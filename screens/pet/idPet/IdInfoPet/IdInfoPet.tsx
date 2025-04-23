import { Image, Text, View } from "react-native-ui-lib";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "../../../../styles/Colors";
import WithoutPhoto from "../../../../components/WithoutPhoto";
import { AnimatedImage, LoaderScreen } from "react-native-ui-lib";
import { IdInfoPetProps } from "./types";
import RenderInfoPets from "../../../../components/renders/RenderInfoPets";

const IdInfoPet = ({ route }: IdInfoPetProps) => {
  const user = useSelector((state: any) => state.user.userInfo);
  const { pet } = route.params;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View >
        <View
          padding-10
          paddingB-20
          row
          style={{
            borderBottomColor: Colors.secondGray,
            borderBottomWidth: 1,
          }}
        >
          {pet?.picture ? (
            
            <AnimatedImage
              height={120}
              width={120}
              borderRadius={60}
              source={{ uri: pet.picture }}
              loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
              animationDuration={500}
            />
          ) : (
            <WithoutPhoto />
          )}
          <View marginL-10 centerV>
            <Text text40BL>{pet?.name}</Text>
            <Text text80L color={Colors.gray} marginT-5>
              {`${pet?.age} años | ${pet?.pet_breed?.life_stages?.[0]?.gender} | ${pet?.pet_breed.name}`}
            </Text>
          </View>
        </View>

        <View
          paddingL-30
          paddingV-15
          style={{
            borderBottomColor: Colors.secondGray,
            borderBottomWidth: 1,
          }}
        >
          <Text text70BL>PET PARENT</Text>
        </View>

        <View
          padding-10
          backgroundColor={Colors.white}
          style={{
            borderBottomColor: Colors.secondGray,
            borderBottomWidth: 1,
          }}
        >
          <RenderInfoPets
            icon={require("../../../../assets/user-icon.png")}
            label="Nombre"
            value={user?.name}
          />
          <RenderInfoPets
            icon={require("../../../../assets/phone-icon.png")}
            label="Celular"
            value={user?.phone}
          />
          <RenderInfoPets
            icon={require("../../../../assets/mail-icon.png")}
            label="E-mail"
            value={user?.email}
          />
        </View>
        <View
          paddingL-30
          paddingV-15
          style={{
            borderBottomColor: Colors.secondGray,
            borderBottomWidth: 1,
          }}
        >
          <Text text70BL>MASCOTA</Text>
        </View>
        <View
          padding-10
          backgroundColor={Colors.white}
          marginB-10
          style={{
            borderBottomColor: Colors.secondGray,
            borderBottomWidth: 1,
          }}
        >
          <RenderInfoPets
            icon={require("../../../../assets/fingerprint-icon.png")}
            label="Nombre"
            value={pet?.name}
          />
          <RenderInfoPets
            icon={require("../../../../assets/cake-icon.png")}
            label="Edad"
            value={pet?.age}
          />
          <RenderInfoPets
            icon={require("../../../../assets/pet-dog-icon.png")}
            label="Raza"
            value={pet?.pet_breed.name}
          />
          <RenderInfoPets
            icon={require("../../../../assets/female.png")}
            label="Género"
            value={pet?.pet_breed?.life_stages?.[0]?.gender}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default IdInfoPet;
