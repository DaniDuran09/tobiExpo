import { Carousel, Text, TouchableOpacity, View, PageControl } from "react-native-ui-lib";
import { Colors } from "../../../../styles/Colors";
import React, { useEffect, useState } from "react";
import HeaderInfoPet from "../../HeaderInfoPet";
import CardVaccine from "../CardVaccine";
import Loading from "../../../Loading";
import Button from "../../../atoms/Button";
import Icon from "react-native-vector-icons/AntDesign";
import UploadImage from "../../../atoms/UploadImage";
import ApiFetcher from "../../../../modules/ApiFetcher";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

const VaccinesPage: React.FC<VaccinesPageProps> = ({
  isLoading,
  vaccineBrands,
  selectedPet,
  allVaccines,
  refreshData,
}) => {
  const [idEditPet, setIdEditPet] = useState<string | number | null>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [certificates, setCertificates] = useState<any>({
    certificate_deworming: null,
    certificate_vaccine: null
  });

  const apiFetcher = new ApiFetcher();

  useEffect(() => {
    if (selectedPet?.id) {
      getCertificateVaccine();
    }
  }, [selectedPet]);

  const getCertificateVaccine = async () => {
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

  const saveCertificateVaccine = async (uri: any, filename: any) => {
    if (!selectedPet?.id) return;
    setLoadingUpload(true);
    try {
      const formData = new FormData();
      formData.append("certificate_vaccine", {
        uri: uri,
        type: "image/jpeg",
        name: filename,
      } as any);
      const response = await apiFetcher.saveCertificate(selectedPet.id, formData);
      await getCertificateVaccine();
      setVisible(false);
      Toast.show({
        type: "success",
        text1: "Certificado subido correctamente",
        text2: "El certificado de vacunación se ha subido correctamente",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingUpload(false);
    }
  };
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
            {allVaccines.map((item) => (
              <CardVaccine
                key={item.uid || item.id}
                idPet={selectedPet.id}
                vaccineBrands={vaccineBrands}
                item={item}
                setIdEditPet={setIdEditPet}
                idEditPet={idEditPet}
                refreshData={refreshData}
                type={"vaccines"}
              />
            ))}
          </Carousel>
          {allVaccines.length > 0 && (
            <PageControl
              containerStyle={{ marginTop: 10, alignSelf: 'center' }}
              numOfPages={allVaccines.length}
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
          {//idEditPet == null && (
            <View row spread>
              <View />
              <TouchableOpacity
                disabled={isLoading || idEditPet != null}
                marginB-25
                onPress={() => setVisible(true)}
                backgroundColor={Colors.mediumGray}
                paddingH-20
                paddingV-10
                br20
                row
                center
              >
                <Icon name="upload" size={20} color={Colors.white} />
                <Text color={Colors.white}>Certificado</Text>
              </TouchableOpacity>
            </View>
            //)
          }
        </View>
      </View>
      <UploadImage
        loading={loadingUpload}
        type="vacunación"
        defaultImage={certificates?.certificate_vaccine}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        onUpload={saveCertificateVaccine}
      />
    </View>
  );
};

export default VaccinesPage;
