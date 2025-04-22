import { Image, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../../styles/Colors";
import WithoutPhoto from "../../../components/WithoutPhoto";
import { AnimatedImage, LoaderScreen, Text, View } from "react-native-ui-lib";

const IdInfoPet = ({ route }) => {
  const user = useSelector((state) => state.user.userInfo);
  const { pet } = route.params;

  const [option, setOption] = useState(1);

  const rawGender = pet?.pet_breed?.life_stages?.[0]?.gender;
  const petGender =
    rawGender === "male"
      ? "Macho"
      : rawGender === "female"
      ? "Hembra"
      : "Sin especificar";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.containerInfo}>
        <View padding-10 row gap-10>
          {pet?.picture ? (
            <AnimatedImage
              source={{ uri: pet.picture }}
              style={styles.image}
              loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
              animationDuration={500}
            />
          ) : (
            <WithoutPhoto />
          )}
          
            <View centerV>
              <Text text40BL>{pet.name}</Text>
              <Text text80L color={Colors.gray} marginT-5>
                {`${pet?.age} años | ${petGender} | ${pet.pet_breed.description}`}
              </Text>
            </View>
          
          {/* <Text style={styles.textInfo}>
            {pet?.picture ? "Editar foto de perfil" : "Agregar foto de perfil"}
          </Text> */}
        </View>
        <View style={styles.userInfo}>
          <Text text70BO>PET PARENT</Text>
          <View style={styles.info}>
            <View style={styles.rowInformation}>
              <View style={styles.containerImage}>
                <Image
                  source={require("../../../assets/user-icon.png")}
                  style={{ height: 30, width: 30 }}
                  resize
                  Mode={"cover"}
                />
              </View>
              <Text style={styles.textInformation}>Nombre</Text>
            </View>

            <View style={styles.containerTextInformation}>
              <View style={styles.containerImage} />

              <Text style={styles.Text}>{user?.name}</Text>
            </View>
            <View style={styles.rowInformation}>
              <View style={styles.containerImage}>
                <Image
                  source={require("../../../assets/phone-icon.png")}
                  style={{ height: 30, width: 30 }}
                  resizeMode={"cover"}
                />
              </View>
              <Text style={styles.textInformation}>Celular</Text>
            </View>
            <View style={styles.containerTextInformation}>
              <View style={styles.containerImage} />

              <Text style={styles.Text}>{user?.phone}</Text>
            </View>

            <View style={styles.rowInformation}>
              <View style={styles.containerImage}>
                <Image
                  source={require("../../../assets/mail-icon.png")}
                  style={{ height: 25, width: 25 }}
                  resizeMode={"contain"}
                />
              </View>
              <Text style={styles.textInformation}>E-mail</Text>
            </View>
            <View style={styles.containerTextInformation}>
              <View style={styles.containerImage} />

              <Text style={styles.Text}>{user?.email}</Text>
            </View>
          </View>
        </View>
        <View style={styles.userInfo}>
          <Text text70BO>Mascota</Text>
          <View style={styles.info}>
            <View style={styles.rowInformation}>
              <View style={styles.containerImage}>
                <Image
                  source={require("../../../assets/fingerprint-icon.png")}
                  style={{ height: 20, width: 20 }}
                  resizeMode={"cover"}
                />
              </View>
              <Text style={styles.textInformation}>Nombre</Text>
            </View>
            <View style={styles.containerTextInformation}>
              <View style={styles.containerImage} />

              <Text style={styles.Text}>{pet?.name}</Text>
            </View>
            <View style={styles.rowInformation}>
              <View style={styles.containerImage}>
                <Image
                  source={require("../../../assets/cake-icon.png")}
                  style={{ height: 20, width: 20 }}
                  resizeMode={"cover"}
                />
              </View>
              <Text style={styles.textInformation}>Edad</Text>
            </View>
            <View style={styles.containerTextInformation}>
              <View style={styles.containerImage} />

              <Text style={styles.Text}>{pet?.age}</Text>
            </View>

            <View style={styles.rowInformation}>
              <View style={styles.containerImage}>
                <Image
                  source={require("../../../assets/pet-dog-icon.png")}
                  style={{ height: 25, width: 25 }}
                  resizeMode={"contain"}
                />
              </View>
              <Text style={styles.textInformation}>Raza</Text>
            </View>
            <View style={styles.containerTextInformation}>
              <View style={styles.containerImage} />

              <Text style={styles.Text}>{pet?.pet_breed.name}</Text>
            </View>
            <View style={styles.rowInformation}>
              <View style={styles.containerImage}>
                <Image
                  source={require("../../../assets/female.png")}
                  style={{ height: 25, width: 25 }}
                  resizeMode={"contain"}
                />
              </View>
              <Text style={styles.textInformation}>Género</Text>
            </View>
            <View style={styles.containerTextInformation}>
              <View style={styles.containerImage} />

              <Text style={styles.Text}>{pet?.gender}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default IdInfoPet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  containerInfo: {
    paddingTop: 15,
  },
  headerContainer: {
    alignItems: "center",
  },
  textInfo: {
    fontSize: 14,
    color: "black",
    fontWeight: "300",
    marginTop: 10,
  },
  image: {
    height: 120,
    width: 120,
    zIndex: 0,
    borderRadius: 60,
  },
  selectContainer: {
    justifyContent: "center",
    flexDirection: "row",
    gap: 20,
    marginTop: 30,
    paddingBottom: 0,
  },
  selected: {
    color: Colors.primaryColor,
    fontWeight: "600",
    fontSize: 16,
  },
  notSelected: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.gray,
  },
  optionSelected: {
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 2,
  },
  userInfo: {
    padding: 10,
    paddingBottom: 0,
    backgroundColor: Colors.white,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: Colors.primaryColor,
    fontWeight: "600",
  },
  rowInformation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  containerTextInformation: {
    borderBottomColor: Colors.gray,
    borderBottomWidth: 0.3,
    paddingBottom: 10,
    flexDirection: "row",
  },
  textInformation: {
    fontSize: 16,
    fontWeight: "500",
  },
  Text: {
    fontWeight: "900",
    fontSize: 16,
  },
  info: {},
  containerImage: {
    width: "10%",
  },
  button: {
    marginTop: 30,
    marginBottom: 30,
    height: 60,
    width: "90%",
    minWidth: 400,
    backgroundColor: "#EF4136",
    borderRadius: 65,
    justifyContent: "center",
  },
  textButton: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },
  containerButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  bottomContainer: {
    width: "80%",
  },
  containerEditInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textEdit: {
    fontSize: 14,
    color: Colors.primaryColor,
  },
});
