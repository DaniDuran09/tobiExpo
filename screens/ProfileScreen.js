import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  Image,
  RefreshControl,
  TouchableWithoutFeedback,
  FlatList,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BottomMenu from "../components/BottomMenu";
import AppStorage from "../modules/AppStorage";
import WithoutPhoto from "../components/WithoutPhoto";
import Loading from "../components/Loading";
import { Colors } from "../styles/Colors";
import ApiFetcher from "../modules/ApiFetcher";
import DeleteModal from "../components/DeleteModal";
import NoPets from "../components/NoPets";
import { useFocusEffect } from "@react-navigation/native";
import ImageOption from "../components/ImageOption";
import * as ImagePicker from "expo-image-picker";
import { AnimatedImage, LoaderScreen, Text } from "react-native-ui-lib";
import Toast from "react-native-toast-message";

const ProfileScreen = ({ route, navigation }) => {
  const user = useSelector((state) => state.user.userInfo);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageSource, setImageSource] = useState(null);

  const [userData, setUserData] = useState({});
  const [showDeleteModal, setShowDeletModal] = useState(false);
  const [idItemSelected, setIdItemSelected] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const appStorage = new AppStorage();
  const apiFetcher = new ApiFetcher();
  const dispatch = useDispatch();

  useEffect(() => {
    petList();
  }, []);

  useFocusEffect(
    useCallback(() => {
      petList();
      return () => {};
    }, [navigation])
  );

  // useEffect(() => {
  //   (async () => {
  //     const { status } =
  //       await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== "granted") {
  //       Alert.alert(
  //         "Permiso necesario",
  //         "Se requieren permisos para acceder a la galería"
  //       );
  //     }
  //   })();
  // }, []);

  const selectImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImageSource({ uri: result.uri });
        closeModal();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ha ocurrido un error",
        text2: `Inténtalo de nuevo más tarde`,
      });
      console.log("Error: ", error);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImageSource({ uri: result.uri });
        closeModal();
      }
    } catch (error) {
      Alert.alert(
        "Ha ocurrido un error al tomar la foto",
        "Puedes continuar y después agregar una foto"
      );
      console.log("Error: ", error);
    }
  };

  const closeModal = () => setModalVisible(false);

  const petList = async () => {
    try {
      const list = await apiFetcher.getPets();
      if (list) setData(list.data);
      const user = await appStorage.getUser();
      setUserData(user);
    } catch (e) {
      console.log("Error: ", e);
      Toast.show({
        type: "error",
        text1: "Ocurrió un error",
        text2: `Inténtalo de nuevo más tarde`,
      });
    } finally {
      setLoading(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeletModal(false);
    setIdItemSelected(0);
  };

  const deletePet = async (id) => {
    try {
      const status = await apiFetcher.deletePet(id);
      console.log("IMPRIME EL STATUS", status);

      if (status.code === 200) {
        closeDeleteModal();
        petList();
      }
    } catch (error) {
      Alert.alert("Error", "Error al intentar eliminar a la mascota");
      console.error(error);
    }
  };

  const selectDeleteItem = (id) => {
    setIdItemSelected(id);
    setShowDeletModal(true);
  };
  const renderItem = (item) => {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate("HomeProfileDetails", { item, tabIndex: 0 })
        }
      >
        <View
          style={{
            height: 80,
            width: "100%",
            backgroundColor: "yellow",
            flexDirection: "row",
            backgroundColor: "white",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              height: "100%",
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AnimatedImage
              source={{ uri: item.picture }}
              style={{ width: 50, height: 50, borderRadius: 32 }}
              loader={<LoaderScreen color={Colors.primaryColor} size={15} />}
              animationDuration={500}
            />
            {/* <Avatar.Image
              source={{
                uri: item.picture,
              }}
              size={50}
              style={{ backgroundColor: "lightgrey" }}
            /> */}
          </View>
          <View
            style={{
              height: "100%",
              width: "50%",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18, color: "black", fontWeight: "bold" }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 16, color: "black", fontWeight: "400" }}>
              {item.pet_breed.name}
            </Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.navigate("EditPet", {
                id: item.id,
                refreshData: petList,
              })
            }
          >
            <View
              style={{
                height: "100%",
                width: "15%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/edit-icon.png")}
                style={{ height: 25, width: 25 }}
                resizeMode={"contain"}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => selectDeleteItem(item.id)}>
            <View
              style={{
                height: "100%",
                width: "15%",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../assets/trash-icon.png")}
                style={{ height: 25, width: 25 }}
                resizeMode={"contain"}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View
      style={{
        backgroundColor: "#fff", //#E6F8DB
        alignItems: "center",
        flex: 1,
      }}
    >
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <View style={{ height: "20%", width: "100%", alignItems: "center" }}>
        {userData.picture ? (
          <AnimatedImage
            source={{ uri: userData.picture }}
            style={styles.image}
            resizeMode={"cover"}
            loader={<LoaderScreen color={Colors.primaryColor} size={15} />}
            animationDuration={500}
          />
        ) : (
          <>
            <WithoutPhoto />
            <>
              <Text
                style={{
                  fontSize: 14,
                  color: "black",
                  fontWeight: "300",
                  marginTop: 5,
                }}
              >
                Agregar foto de perfil
              </Text>
            </>
          </>
        )}
      </View>
      <View
        style={{
          height: "10%",
          width: "100%",
          paddingHorizontal: 15,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../assets/back-icon.png")}
              style={{ height: 18, width: 18 }}
              resizeMode={"contain"}
            />
            <Text text50BL marginL-10>{`${user?.name}`}</Text>
          </View>
          <Text text70 marginL-30>
            Mis mascotas
          </Text>
        </View>
      </View>
      <View style={{ height: "38%", width: "100%" }}>
        <View style={{ width: "100%", height: "100%" }}>
          {data.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => `item-${index}`}
              data={data}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={petList} />
              }
              renderItem={({ item }) => renderItem(item)}
            />
          ) : (
            <View style={styles.noPetsContainer}>
              <NoPets />
            </View>
          )}
        </View>
      </View>
      <BottomMenu />
      <DeleteModal
        visible={showDeleteModal}
        closeModal={closeDeleteModal}
        deletePet={() => deletePet(idItemSelected)}
      />
      <ImageOption
        visible={modalVisible}
        closeModal={closeModal}
        selectImageFromLibrary={selectImageFromLibrary}
        takePhoto={takePhoto}
      />
    </View>
  );
};

export default ProfileScreen;

const { height, width } = Dimensions.get("window");
const height_logo = height * 0.18;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#694fad",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
    borderRadius: 150,
    backgroundColor: "lightgrey",
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  image: {
    height: 120,
    width: 120,
    zIndex: 0,
    borderRadius: 60,
    overflow: "hidden",
    marginTop: 15,
  },
  noPetsContainer: {
    marginTop: "5%",
    alignItems: "center",
    height: "40%",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    backgroundColor: Colors.white,
  },
});
