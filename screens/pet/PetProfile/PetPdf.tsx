import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Image, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedImage, Modal, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import ApiFetcher from "../../../modules/ApiFetcher";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getCards } from '../../../services';
import Pdf from 'react-native-pdf';
import ModalNoPicture from '../../../components/atoms/ModalNoPicture';
import { Colors } from "../../../styles/Colors";
import { navigateBack, NavSource } from "../../../utils/navigateBack";

export default function PetPdf() {

  const apiFetcher = new ApiFetcher();

  type Certificate = {
    certificate_pet: string;
    certificate_deworming: string;
    certificate_vaccine: string;
  };

  const [certificates, setCertificates] = useState<Certificate | null>(null);
  const route = useRoute();
  const navigation = useNavigation<any>();
  const params = (route.params || {}) as any;
  const source = params.source as NavSource | undefined;

  const [petData, setPetData] = useState<any>(params.pet || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState(false);
  const [dialog, setDialog] = useState<boolean>(false);
  const [picture, setPicture] = useState<string>("");
  const [pdfError, setPdfError] = useState<boolean>(false);

  useEffect(() => {
    resolvePetAndCertificates();
  }, [params.pet, params.petId, params.id, params.pet_id]);

  const resolvePetAndCertificates = async () => {
    setLoading(true);
    setPdfError(false);
    try {
      let currentPet = params.pet;
      let targetPetId =
        (typeof currentPet === 'object' && currentPet?.id ? currentPet.id : null) ||
        (typeof currentPet === 'number' || typeof currentPet === 'string' ? currentPet : null) ||
        params.petId ||
        params.pet_id ||
        params.id ||
        params.idSelectedPet;

      // Si no tenemos ID, buscar las mascotas del usuario
      if (!targetPetId) {
        try {
          const petsRes = await apiFetcher.getPets();
          if (petsRes?.data && petsRes.data.length > 0) {
            targetPetId = petsRes.data[0].id;
            if (!currentPet) {
              currentPet = petsRes.data[0];
            }
          }
        } catch (e) {
          console.warn("Error fetching pets in PetPdf:", e);
        }
      }

      // Si tenemos targetPetId pero falta información completa de la mascota
      if (targetPetId && (!currentPet || typeof currentPet !== 'object' || !currentPet.name)) {
        try {
          const petRes = await apiFetcher.getPetById(targetPetId);
          if (petRes?.data) {
            currentPet = petRes.data;
          }
        } catch (e) {
          console.warn("Error fetching pet details in PetPdf:", e);
        }
      }

      if (currentPet && typeof currentPet === 'object') {
        setPetData(currentPet);
      } else if (targetPetId) {
        setPetData({ id: targetPetId, name: "Mascota" });
      }

      if (targetPetId) {
        const res = await apiFetcher.getCertificates(targetPetId);
        if (res && res.data) {
          setCertificates(res.data);
        }
      }
    } catch (error) {
      console.log("Error loading certificates in PetPdf:", error);
    } finally {
      setLoading(false);
    }
  };

  const openImage = (url: any, tipe: string) => {
    if (url) {
      Linking.openURL(url).catch(err => console.log("Error opening URL:", err));
    } else {
      setVisible(true);
      setPicture(tipe);
    }
  };
  const onRequestClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    console.log("imagen", picture);
  }, [picture]);

  return (
    <SafeAreaView style={styles.container}>
      <View width={'100%'} height={55} row paddingH-10 centerV style={{ borderBottomWidth: 1, borderBottomColor: Colors.secondGray }}>
        <TouchableOpacity
          br100
          style={{ height: 50, paddingRight: 10 }}
          row
          centerV
          onPress={() => navigateBack(source, navigation)}
        >
          <Icon name="chevron-left" size={38} color="black" />
          {petData?.picture ? (
            <AnimatedImage source={{ uri: petData.picture }} style={{ width: 38, height: 38, borderRadius: 100 }} />
          ) : (
            <View style={{ width: 38, height: 38, borderRadius: 100, backgroundColor: Colors.secondGray }} center>
              <Icon name="paw" size={20} color={Colors.gray} />
            </View>
          )}
          {petData?.name ? (
            <Text text70BL marginL-10 color={Colors.black}>
              {petData.name}
            </Text>
          ) : null}
        </TouchableOpacity>
        <View flex />
        <TouchableOpacity style={{ width: 50, height: 50 }} center onPress={() => openImage(certificates?.certificate_pet, "")}>
          <Image
            source={require("./../../../assets/share.png")}
            style={{ height: 25, width: 25 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.pdfContainer}>
        {certificates?.certificate_pet ? (
          pdfError ? (
            <View center flex>
              <Text black marginB-10>No se pudo cargar el PDF.</Text>
              <TouchableOpacity onPress={() => Linking.openURL(certificates.certificate_pet)}>
                <Text style={{ color: '#1565C0', textDecorationLine: 'underline' }}>Abrir en navegador</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Pdf
              source={{ uri: certificates.certificate_pet, cache: true }}
              style={styles.pdf}
              trustAllCerts={false}
              onError={(error) => {
                console.log("Error loading PDF:", error);
                setPdfError(true);
              }}
            />
          )
        ) : (
          <View center flex>
            <Text black>Cargando PDF...</Text>
          </View>
        )}
      </View>
      <View paddingH-10 paddingV-5>
        <TouchableOpacity row centerV onPress={() => openImage(certificates?.certificate_deworming, "desparasitaciones")}>
          <Image
            source={require("./../../../assets/jpgLogo.png")}
            style={{ height: 25, width: 25 }}
          />
          <Text grey40 >desp.jpg</Text>
        </TouchableOpacity>
        <TouchableOpacity row centerV marginT-5 onPress={() => openImage(certificates?.certificate_vaccine, "vacunas")}>
          <Image
            source={require("./../../../assets/jpgLogo.png")}
            style={{ height: 25, width: 25 }}
          />
          <Text grey40 >vacunas.jpg</Text>
        </TouchableOpacity>
      </View>
      <ModalNoPicture
        visible={visible}
        onRequestClose={onRequestClose}
        picture={picture}
      />
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
  },
  pdfContainer: {
    backgroundColor: '#313131',
    paddingVertical: '5%',
    width: '100%',
    height: '70%',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});