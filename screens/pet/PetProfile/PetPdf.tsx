import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedImage, Modal, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import ApiFetcher from "../../../modules/ApiFetcher";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getCards } from '../../../services';
import WebView from 'react-native-webview';
import ModalNoPicture from '../../../components/atoms/ModalNoPicture';

export default function PetPdf() {

  const apiFetcher = new ApiFetcher();

type Certificate = {
  certificate_pet: string;
  certificate_deworming:string;
  certificate_vaccine:string;
};

  const [certificates, setCertificates] = useState<Certificate | null>(null);
  const route = useRoute();
  const { pet }:any = route.params;
  console.log(pet)
  const navigation = useNavigation();
  const [visible,setVisible] = useState(false);
  const [dialog,setDialog] = useState<boolean>(false);
  const [picture,setPicture] = useState<string>("");
  useEffect(() => {
    getCertificates();
  }, [])

  const openImage = (url: any,tipe:string) => {
    const urlImage = url

    console.log(certificates)
    if (urlImage !== null) {
      Linking.openURL(urlImage)
    }else{
      setVisible(true)
      setPicture(tipe);
    }
  }
  const onRequestClose = () =>{
    setVisible(false)
  }

  const getCertificates = async () => {
    try {
      const res = await apiFetcher.getCertificates(pet.id);
      setCertificates(res.data)
    } catch (error) {
      console.log("error", error);
    }
  }
  useEffect(()=>{
    console.log("imagen",picture);
  },[picture])
  

  return (
    <SafeAreaView style={styles.container}>
      <View width={'100%'} height={50} row paddingR-10 centerV>
        <TouchableOpacity br100 style={{ width: 100, height: 50 }} row centerV onPress={() =>  navigation.goBack() }>
          <Icon name="chevron-left" size={45} color="black" />
          <AnimatedImage source={{ uri: pet.picture }} style={{ width: 40, height: 40, borderRadius: 100 }} />
        </TouchableOpacity>
        <View flex />
        <TouchableOpacity style={{ width: 50, height: 50 }} center onPress={() =>  openImage(certificates?.certificate_pet,"")}>
          <Image
            source={require("./../../../assets/share.png")}
            style={{ height: 25, width: 25 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.pdfContainer}>
        {certificates?.certificate_pet ? (
  <WebView
    source={{
      uri: `https://docs.google.com/gview?embedded=true&url=${certificates?.certificate_pet}`
    }}
    style={styles.pdf}
    javaScriptEnabled
    originWhitelist={['*']}
  />
) : (
  <Text black>Cargando PDF...</Text>
)}
      </View>
      <View paddingH-10 paddingV-10>
        <TouchableOpacity row centerV onPress={() =>  openImage(certificates?.certificate_deworming,"desparasitaciones")}>
          <Image
            source={require("./../../../assets/jpgLogo.png")}
            style={{ height: 25, width: 25 }}
          />
          <Text grey40 >desp.jpg</Text>
        </TouchableOpacity>
        <TouchableOpacity row centerV marginT-5 onPress={() => openImage(certificates?.certificate_vaccine,"vacunas")}>
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
    backgroundColor:'#313131',
    paddingVertical:'10%',
    width: '100%',
    height: '70%',
  },
  pdf: {
    width: '100%',
    borderRadius: 10,
  },
});