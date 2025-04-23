import { Carousel, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { Colors } from "../../../../styles/Colors";
import React, { useState } from "react";
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
          {allDerwomers.map((item) => (
            <CardVaccine
              idPet={selectedPet.id}
              derwomersBrands={derwomersBrands}
              item={item}
              setIdEditPet={setIdEditPet}
              idEditPet={idEditPet}
              refreshData={refreshData}
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
                marginT-25
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
