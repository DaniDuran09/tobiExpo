import { View } from "react-native-ui-lib";
import React, { useState } from "react";
import HeaderInfoPet from "../../HeaderInfoPet";
import { FlatList } from "react-native";
import CardVaccine from "../CardVaccine";

const VaccinesPage: React.FC<VaccinesPageProps> = ({
  selectedPet,
  allVaccines,
}) => {
  const [idEditPet, setIdEditPet] = useState<number | null>(null);
  return (
    <View marginT-15>
      <View marginB-25>
        <HeaderInfoPet pet={selectedPet} />
      </View>
      <FlatList
        data={allVaccines}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
         <CardVaccine
            item={item}
            setIdEditPet={setIdEditPet}
            idEditPet={idEditPet}
          />    
        )}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 50,
        }}
        snapToInterval={390}
        decelerationRate="fast"
      />
      <View absR absB marginR-20>
        {/* <View>
          <TouchableOpacity>
            <Text>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Certificado</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

export default VaccinesPage;
