import { Carousel, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { Colors } from "../../../../styles/Colors";
import React, { useState, useMemo } from "react";
import HeaderInfoPet from "../../HeaderInfoPet";
import CardVaccine from "../CardVaccine";
import Loading from "../../../Loading";
import Button from "../../../atoms/Button";
import Icon from "react-native-vector-icons/AntDesign";
import UploadImage from "../../../atoms/UploadImage";

const DerwomersPage: React.FC<DerwomersPageProps> = ({
  isLoading,
  derwomersBrands,
  selectedPet,
  allDerwomers,
  refreshData,
}) => {
  const [idEditPet, setIdEditPet] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  const filteredDewormers = useMemo(() => {
    // Verificar si hay una desparasitación de "Ambas en una aplicacion" registrada
    const hasBoth = allDerwomers.some(
      (dewormer) =>
        dewormer.applied &&
        dewormer.deworming_type === "Ambas en una aplicacion"
    );

    // Verificar si hay desparasitaciones de "Interna" o "Externa" registradas
    const hasInternalOrExternal = allDerwomers.some(
      (dewormer) =>
        dewormer.applied &&
        (dewormer.deworming_type === "Interna" ||
          dewormer.deworming_type === "Externa")
    );

    console.log("hasBoth:", hasBoth);
    console.log("hasInternalOrExternal:", hasInternalOrExternal);
    console.log("allDerwomers:", allDerwomers);

    return allDerwomers.filter((dewormer) => {
      const typeToRegister = dewormer.deworming_type_toRegister;

      // Si hay una de "Ambas", solo mostrar "Ambas"
      if (hasBoth) {
        return typeToRegister === "Ambas en una aplicacion";
      }

      // Si hay de "Interna" o "Externa", no mostrar "Ambas"
      if (hasInternalOrExternal) {
        return typeToRegister !== "Ambas en una aplicacion";
      }

      return true;
    });
  }, [allDerwomers]);

  return (
    <View marginT-15 flexG>
      <View marginB-25>
        <HeaderInfoPet pet={selectedPet} />
      </View>
      {isLoading ? (
        <View flex center marginT-100>
          <Loading
            backgroundColor={Colors.white}
            textColor={Colors.primaryColor}
          />
        </View>
      ) : (
        <Carousel
          initialPage={0}
          pageControlPosition={Carousel.pageControlPositions.UNDER}
        >
          {filteredDewormers.map((item) => (
            <CardVaccine
              key={item.id}
              idPet={selectedPet.id}
              vaccineBrands={derwomersBrands}
              item={item}
              setIdEditPet={setIdEditPet}
              idEditPet={idEditPet}
              refreshData={refreshData}
              type={"derwomers"}
            />
          ))}
        </Carousel>
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
          )}
        </View>
      </View>
      <UploadImage
        visible={visible}
        onRequestClose={() => setVisible(false)}
        onUpload={() => {}}
      />
    </View>
  );
};

export default DerwomersPage;
