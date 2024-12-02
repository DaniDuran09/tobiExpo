import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const WithoutPhoto = () => {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Image
          source={require("../assets/camera-icon.png")}
          style={styles.image}
          resizeMode={"contain"}
        />
      </View>
    </TouchableOpacity>
  );
};

export default WithoutPhoto;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  image: {
    height: 30,
    width: 30,
  },
});