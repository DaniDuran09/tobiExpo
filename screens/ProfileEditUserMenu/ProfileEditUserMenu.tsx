import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { Text, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import AppStorage from "../../modules/AppStorage";
import { Colors } from "../../styles/Colors";
import { clearUser, setUserInfo } from "../../redux/slice/userSlice";
import ApiFetcher from "../../modules/ApiFetcher";
import Loading from "../../components/Loading";
import WithoutPhoto from "../../components/WithoutPhoto";
import { clearPetInfo } from "../../redux/slice/petSlice";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


const ProfileEditUserMenu: React.FC = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [imageSource, setImageSource] = useState<{ uri: string } | null>(null);
  const appStorage = new AppStorage();
  const apiFetcher = new ApiFetcher();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiFetcher.getProfile();
      if (response) setUserData(response.data);
    } catch (e) {
      console.log("Error: ", e);
      Toast.show({
        type: "error",
        text1: "Ha ocurrido un error",
        text2: `Inténtalo de nuevo más tarde`,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await appStorage.clearStorage();
      dispatch(clearUser());
      dispatch(clearPetInfo());
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Error al cerrar sesión`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <Loading textColor={Colors.white} backgroundColorProp={Colors.white} />
      )}
      <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: "column" }}
          behavior={"height"}
          enabled
        >
          <View
            style={{
              backgroundColor: "#fff",
              marginTop: Platform.OS === "android" ? "5%" : undefined,
            }}
          >
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 25,
              }}
            >
              <View>
                {userData.picture ? (
                  <Image
                    source={
                      imageSource
                        ? { uri: imageSource.uri }
                        : { uri: userData.picture }
                    }
                    style={styles.image}
                    resizeMode={"cover"}
                  />
                ) : (
                  <WithoutPhoto />
                )}
              </View>
            </View>

            <View paddingT-20 style={{ width: "100%", marginLeft: "5%" }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ProfileEditUser")}
              >
                <View
                  row
                  spread
                  centerV
                  paddingV-15
                  width={"90%"}
                  style={{
                    borderBottomWidth: 0.2,
                    borderBottomColor: Colors.secondGray,
                  }}
                >
                  <View row gap-10 centerV marginL-10>
                    <Text text70>Editar perfil</Text>
                  </View>
                  <View row gap-10 centerV>
                    <Icon
                      name="chevron-right"
                      size={25}
                      color={Colors.secondGray}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("ChangePassword")}
              >
                <View
                  row
                  spread
                  centerV
                  paddingV-15
                  width={"90%"}
                  style={{
                    borderBottomWidth: 0.2,
                    borderBottomColor: Colors.secondGray,
                  }}
                >
                  <View row gap-10 centerV marginL-10>
                    <Text text70>Cambiar contraseña</Text>
                  </View>
                  <View row gap-10 centerV>
                    <Icon
                      name="chevron-right"
                      size={25}
                      color={Colors.secondGray}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        <View center paddingB-15>
          <TouchableOpacity
            style={{
              marginTop: 10,
              flexDirection: "row",
              width: "90%",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
            onPress={logout}
          >
            <Text color={Colors.primaryColor}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ProfileEditUserMenu;

const styles = StyleSheet.create({
  image: {
    height: 120,
    width: 120,
    zIndex: 0,
    borderRadius: 60,
    overflow: "hidden",
    marginTop: 15,
  },
});
