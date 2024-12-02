import { StyleSheet, Text, View } from "react-native";
import React from "react";

const HeaderTitle = (props) => {
  const { title } = props;
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

export default HeaderTitle;

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: "5%",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#EF4136",
  },
});
