import { Image, Text, View } from "react-native-ui-lib";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "../../../../styles/Colors";
import WithoutPhoto from "../../../../components/WithoutPhoto";
import { AnimatedImage, LoaderScreen } from "react-native-ui-lib";
import { IdInfoPetProps } from "./types";

const IdInfoPet = ({ route }: IdInfoPetProps) => {
  const user = useSelector((state: any) => state.user.userInfo);
  const { pet } = route.params;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View paddingT-10>
        <View
          padding-10
          row
          style={{
            shadowColor: Colors.gray,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 5,
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

        <View padding-10 row gap-20 marginV-5>
          <Text text70BL>PET PARENT</Text>
        </View>

        <View
          padding-10
          backgroundColor={Colors.white}
          marginB-10
          style={{
            shadowColor: Colors.gray,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <View>
            <View row marginT-15>
              <View width={"10%"}>
                <Image
                  source={require("../../../../assets/user-icon.png")}
                  style={{ height: 30, width: 30 }}
                  resizeMode={"cover"}
                />
              </View>

              <Text text70L>Nombre</Text>
            </View>
            <View
              style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.3 }}
              row
              paddingB-10
            >
              <View width={"10%"} />
              <Text text70BL>{user?.name}</Text>
            </View>
            <View row marginT-15>
              <View width={"10%"}>
                <Image
                  source={require("../../../../assets/phone-icon.png")}
                  style={{ height: 30, width: 30 }}
                  resizeMode={"cover"}
                />
              </View>
              <Text text70L>Celular</Text>
            </View>
            <View
              style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.3 }}
              row
              paddingB-10
            >
              <View width={"10%"} />
              <Text text70BL>{user?.phone}</Text>
            </View>
            <View row marginT-15>
              <View width={"10%"}>
                <Image
                  source={require("../../../../assets/mail-icon.png")}
                  style={{ height: 25, width: 25 }}
                  resizeMode={"contain"}
                />
              </View>
              <Text text70L>E-mail</Text>
            </View>
            <View
              style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.3 }}
              row
              paddingB-10
            >
              <View width={"10%"} />
              <Text text70BL>{user?.email}</Text>
            </View>
          </View>
        </View>
        <View padding-10 row gap-20 marginV-5>
          <Text text70BL>MASCOTA</Text>
        </View>
        <View
          padding-10
          backgroundColor={Colors.white}
          marginB-10
          style={{
            shadowColor: Colors.gray,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <View>
            <View row marginT-15>
              <View width={"10%"}>
                <Image
                  source={require("../../../../assets/fingerprint-icon.png")}
                  style={{ height: 20, width: 20 }}
                  resizeMode={"cover"}
                />
              </View>
              <Text text70L>Nombre</Text>
            </View>
            <View
              style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.3 }}
              row
              paddingB-10
            >
              <View width={"10%"} />
              <Text text70BL>{pet?.name}</Text>
            </View>
            <View row marginT-15>
              <View width={"10%"}>
                <Image
                  source={require("../../../../assets/cake-icon.png")}
                  style={{ height: 20, width: 20 }}
                  resizeMode={"cover"}
                />
              </View>
              <Text text70L>Edad</Text>
            </View>
            <View
              style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.3 }}
              row
              paddingB-10
            >
              <View width={"10%"} />
              <Text text70BL>{pet?.age}</Text>
            </View>
            <View row marginT-15>
              <View width={"10%"}>
                <Image
                  source={require("../../../../assets/pet-dog-icon.png")}
                  style={{ height: 25, width: 25 }}
                  resizeMode={"contain"}
                />
              </View>
              <Text text70L>Raza</Text>
            </View>
            <View
              style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.3 }}
              row
              paddingB-10
            >
              <View width={"10%"} />
              <Text text70BL>{pet?.pet_breed.name}</Text>
            </View>
            <View row marginT-15>
              <View width={"10%"}>
                <Image
                  source={require("../../../../assets/female.png")}
                  style={{ height: 25, width: 25 }}
                  resizeMode={"contain"}
                />
              </View>
              <Text text70L>Género</Text>
            </View>
            <View
              style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.3 }}
              row
              paddingB-10
            >
              <View width={"10%"} />
              <Text text70BL>
                {pet?.pet_breed?.life_stages?.[0]?.gender}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default IdInfoPet;
