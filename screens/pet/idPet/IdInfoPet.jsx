import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../../styles/Colors";
import WithoutPhoto from "../../../components/WithoutPhoto";

const IdInfoPet = ({ route }) => {
  const user = useSelector((state) => state.user.userInfo);
  const { pet } = route.params;

  const [option, setOption] = useState(1);

  const dispatch = useDispatch();

  console.log("EL user: ", user)

  return (
    <ScrollView style={styles.container}>
      <View style={styles.containerInfo}>
        <View style={styles.headerContainer}>
          {pet?.picture ? (
            <Image
              source={{ uri: pet.picture }}
              style={styles.image}
              resizeMode={"cover"}
            />
          ) : (
            <WithoutPhoto />
          )}
          <Text style={styles.textInfo}>
            {pet?.picture ? "Editar foto de perfil" : "Agregar foto de perfil"}
          </Text>
        </View>
        <View style={styles.selectContainer}>
          <TouchableOpacity
            style={option === 1 ? styles.optionSelected : {}}
            onPress={() => setOption(1)}
          >
            <Text style={option === 1 ? styles.selected : styles.notSelected}>
              INFORMACIÓN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={option === 2 ? styles.optionSelected : {}}
            onPress={() => setOption(2)}
          >
            <Text style={option === 2 ? styles.selected : styles.notSelected}>
              QR
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.title}>Dueño</Text>
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

              <TextInput style={styles.textInput} value={user?.name} />
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

              <TextInput style={styles.textInput} value={user?.phone} />
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

              <TextInput style={styles.textInput} value={user?.email} />
            </View>
          </View>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.title}>Mascota</Text>
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

              <TextInput style={styles.textInput} value={pet?.name} />
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

              <TextInput style={styles.textInput} value={pet.age.toString()} />
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

              <TextInput style={styles.textInput} value={pet.pet_breed.name} />
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

              <TextInput
                style={styles.textInput}
                value={pet.gender}
              />
            </View>
          </View>
        </View>
        {/* <View style={styles.userInfo}>
          <Text style={styles.title}>Estado de salud</Text>
          <View style={styles.info}>
            <View style={styles.rowInformation}>
              <View style={styles.containerImage}>
                <Image
                  source={require("../../../assets/hospital-icon.png")}
                  style={{ height: 20, width: 20 }}
                  resizeMode={"cover"}
                />
              </View>
              <Text style={styles.textInformation}>Alergias</Text>
            </View>
            <View style={styles.containerTextInformation}>
              <View style={styles.containerImage} />

              <TextInput style={styles.textInput} value={"Ninguna"} />
            </View>
            <View style={styles.rowInformation}>
              <View style={styles.containerImage}>
                <Image
                  source={require("../../../assets/cardiology-icon.png")}
                  style={{ height: 20, width: 25 }}
                  resizeMode={"cover"}
                />
              </View>
              <Text style={styles.textInformation}>Condición existente</Text>
            </View>
            <View style={styles.containerTextInformation}>
              <View style={styles.containerImage} />

              <TextInput style={styles.textInput} value={"???????"} />
            </View>
          </View>
        </View> */}
        <View style={styles.containerButton}>
          {/* <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text
              style={styles.textButton}
            >
              Registrar
            </Text>
          </TouchableOpacity> */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.containerEditInfo}>
            <Text
              style={styles.textEdit}
            >Editar información</Text>
                <Image
                  source={require("../../../assets/arrowRigth.png")}
                  style={{ height: 15, width: 10 }}
                  resizeMode={"cover"}
                />
            </TouchableOpacity>
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
    shadowColor: Colors.gray,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginBottom: 10,
    elevation: 5,
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
  textInput: {
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
  containerButton:{
    alignItems: "center",
    marginBottom: 20
  },
  bottomContainer:{
    width: "80%"
  },
  containerEditInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textEdit:{
    fontSize: 14,
    color: Colors.primaryColor
  },
});
