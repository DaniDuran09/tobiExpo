import { StyleSheet, Text, View } from "react-native";
import React, {useState} from "react";
import { WebView } from "react-native-webview";
import { ActivityIndicator } from "react-native-paper";

const ViewWeb = ({ route }) => {
  const { url } = route.params;
  const [load, setLoad] = useState(true);
  return (
    <>
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        onLoad={() => {
          setLoad(false);
        }}
      />
      {load && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F25455" />
          <Text style={styles.textLoading}>Loading...</Text>
        </View>
      )}
    </>
  );
};

export default ViewWeb;

const styles = StyleSheet.create({
  textLoading: {
    color: "#71727A",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
