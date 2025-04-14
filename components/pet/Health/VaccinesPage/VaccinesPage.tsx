import { FeatureHighlight, View } from "react-native-ui-lib";
import { Colors } from "../../../../styles/Colors";
import React, { useState } from "react";
import HeaderInfoPet from "../../HeaderInfoPet";
import { FlatList } from "react-native";
import CardVaccine from "../CardVaccine";
import Loading from "../../../Loading";
import Button from "../../../atoms/Button";
import Icon from "react-native-vector-icons/AntDesign";
import UploadImage from "../../../atoms/UploadImage";

const VaccinesPage: React.FC<VaccinesPageProps> = ({
  isLoading,
  vaccineBrands,
  selectedPet,
  allVaccines,
  refreshData,
}) => {
  const [idEditPet, setIdEditPet] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  return (
    <View marginT-15>
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
        <FlatList
          data={allVaccines}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CardVaccine
              idPet={selectedPet.id}
              vaccineBrands={vaccineBrands}
              item={item}
              setIdEditPet={setIdEditPet}
              idEditPet={idEditPet}
              refreshData={refreshData}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 50,
          }}
          snapToInterval={390}
          decelerationRate="fast"
        />
      )}
      <View absR absB marginR-20>
        <View>
          <Button
            disabled={isLoading || idEditPet != null}
            label="Certificado"
            variant="primary"
            bgColor={Colors.gray}
            icon={<Icon name="upload" size={20} color={Colors.white} />}
            onPress={() => setVisible(true)}
          />
        </View>
      </View>
      <UploadImage
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </View>
  );
};

export default VaccinesPage;
