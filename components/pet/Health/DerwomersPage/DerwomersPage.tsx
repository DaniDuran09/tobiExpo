import { Carousel, Text, TouchableOpacity, View, PageControl } from "react-native-ui-lib";
import { Colors } from "../../../../styles/Colors";
import React, { useState, useMemo, useEffect } from "react";
import HeaderInfoPet from "../../HeaderInfoPet";
import CardVaccine from "../CardVaccine";
import Loading from "../../../Loading";
import Button from "../../../atoms/Button";
import Icon from "react-native-vector-icons/AntDesign";
import ModalNoPicture from "../../../atoms/ModalNoPicture";
import ApiFetcher from "../../../../modules/ApiFetcher";
import { Platform, Linking } from "react-native";
import Toast from "react-native-toast-message";

const DerwomersPage: React.FC<DerwomersPageProps> = ({
  isLoading,
  derwomersBrands,
  dewormersFrequency,
  selectedPet,
  allDerwomers,
  refreshData,
}) => {
  const [idEditPet, setIdEditPet] = useState<string | number | null>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [certificates, setCertificates] = useState<any>({
    certificate_deworming: null,
    certificate_vaccine: null,
  });

  const apiFetcher = new ApiFetcher();

  useEffect(() => {
    if (selectedPet?.id) {
      getCertificateDeworming();
    }
  }, [selectedPet]);

  const getCertificateDeworming = async () => {
    if (!selectedPet?.id) return;

    setLoading(true);
    try {
      const response = await apiFetcher.getCertificates(selectedPet.id);
      setCertificates(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const saveCertificateDeworming = async (uri: any, filename: any) => {
    if (!selectedPet?.id) return;
    setLoadingUpload(true);

    try {
      const formData = new FormData();
      formData.append("certificate_deworming", {
        uri: uri,
        type: "image/jpeg",
        name: filename,
      } as any);
      const response = await apiFetcher.saveCertificate(
        selectedPet.id,
        formData
      );
      await getCertificateDeworming();
      setVisible(false);
      Toast.show({
        type: "success",
        text1: "Certificado subido correctamente",
        text2: "El certificado de desparasitación se ha subido correctamente",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingUpload(false);
    }
  };

  const filteredDewormers = useMemo(() => {
    const normalize = (str: string | undefined) =>
      str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() || "";

    // Verificar si hay una desparasitación de "Ambas en una aplicacion" registrada
    const hasBoth = allDerwomers.some(
      (dewormer) =>
        dewormer.applied &&
        normalize(dewormer.deworming_type) === "ambas en una aplicacion"
    );

    // Verificar si hay desparasitaciones de "Interna" o "Externa" registradas
    const hasInternalOrExternal = allDerwomers.some(
      (dewormer) =>
        dewormer.applied &&
        (normalize(dewormer.deworming_type) === "interna" ||
          normalize(dewormer.deworming_type) === "externa")
    );

    return allDerwomers.filter((dewormer) => {
      const typeToRegister = normalize(dewormer.deworming_type_toRegister);

      // Si hay una de "Ambas", solo mostrar "Ambas"
      if (hasBoth) {
        return typeToRegister === "ambas en una aplicacion";
      }

      // Si hay de "Interna" o "Externa", no mostrar "Ambas"
      if (hasInternalOrExternal) {
        return typeToRegister !== "ambas en una aplicacion";
      }

      return true;
    });
  }, [allDerwomers]);

  return (
    <View marginT-15 flexG>
      <View marginB-25>
        <HeaderInfoPet pet={selectedPet} />
      </View>
      {isLoading || loading ? (
        <View flex center marginT-100>
          <Loading
            backgroundColor={Colors.white}
            textColor={Colors.primaryColor}
          />
        </View>
      ) : (
        <>
          <Carousel
            initialPage={currentPage}
            onChangePage={(newIndex) => setCurrentPage(newIndex)}
          >
            {filteredDewormers.map((item) => (
              <CardVaccine
                key={item.uid || item.id}
                idPet={selectedPet.id}
                vaccineBrands={derwomersBrands}
                dewormersFrequency={dewormersFrequency}
                item={item}
                setIdEditPet={setIdEditPet}
                idEditPet={idEditPet}
                refreshData={refreshData}
                type={"derwomers"}
              />
            ))}
          </Carousel>
          {filteredDewormers.length > 0 && (
            <PageControl
              containerStyle={{ marginTop: 10, alignSelf: 'center' }}
              numOfPages={filteredDewormers.length}
              currentPage={currentPage}
              color={Colors.primaryColor}
              inactiveColor={Colors.gray}
              size={8}
            />
          )}
        </>
      )}
      <View row spread absB absR style={{ marginBottom: "22%" }}>
        <View />
        <View>
          {idEditPet == null && (
            <View row spread>
              <View />
              <TouchableOpacity
                disabled={isLoading || idEditPet != null}
                marginB-25
                onPress={() => {
                  if (certificates?.certificate_deworming) {
                    Linking.openURL(certificates.certificate_deworming).catch(e => console.log("Error opening url:", e));
                  } else {
                    setVisible(true);
                  }
                }}
                backgroundColor={Colors.mediumGray}
                paddingH-20
                paddingV-10
                br20
                row
                center
              >
                <Icon name="filetext1" size={20} color={Colors.white} />
                <Text color={Colors.white} marginL-5>Certificado</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <ModalNoPicture
        visible={visible}
        onRequestClose={() => setVisible(false)}
        picture="desparasitaciones"
      />
    </View>
  );
};

export default DerwomersPage;
