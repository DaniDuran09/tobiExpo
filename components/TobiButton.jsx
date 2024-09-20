import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const TobiButton = (props) => {
  const { onSubmit, buttonText} = props;
  return (
    <TouchableOpacity style={styles.buttonStyles} onPress={onSubmit}>
      <Text style={styles.text}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default TobiButton;

const styles = StyleSheet.create({
  buttonStyles: {
    marginTop: 30,
    height: 60,
    width: "100%",
    backgroundColor: "#EF4136",
    borderRadius: 65,
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },
});
