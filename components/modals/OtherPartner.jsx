import { Modal, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Text, TextField, View, TouchableOpacity } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";

const OtherPartner = ({
  close = () => {},
  visible = false,
  action = () => {},
  vaccine = null,
}) => {
  const [name, setName] = useState("");
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={close}
    >
      <View flex center backgroundColor="rgba(0, 0, 0, 0.8)" onPress={close}>
        <View
          backgroundColor={Colors.white}
          style={{
            borderWidth: 3,
            borderColor: Colors.primaryColor,
            width: "93%",
            padding: 20,
            borderRadius: 12,
            justifyContent: "center",
            elevation: 5,
            maxWidth: 500,
          }}
        >
          <View>
            <TextField
              placeholder={"Nombre del veterinario"}
              floatingPlaceholder
              onChangeText={(text) => setName(text)}
              enableErrors
              validateOnChange
              maxLength={30}
            />
            <View row spread marginT-30 marginH-10>
              <TouchableOpacity
                center
                paddingH-30
                paddingV-15
                br100
                style={styles.cancelButton}
                onPress={() => {
                  close();
                  setName("")
                }}
              >
                <Text text70BO>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!(name != "")}
                center
                paddingH-30
                paddingV-15
                br100
                backgroundColor={name == "" ? "gray" : Colors.primaryColor}
                onPress={() => {
                  action(name, vaccine);
                  close();
                }}
              >
                <Text text70BO color={Colors.white}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OtherPartner;

const styles = StyleSheet.create({
  cancelButton: {
    borderWidth: 1,
    borderRadius: 32,
  },
  acceptButton: {
    width: 120,
    backgroundColor: Colors.primaryColor,
    padding: 15,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
