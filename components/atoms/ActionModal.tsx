import { View, Text, Modal, TouchableOpacity, Image, Button } from "react-native-ui-lib";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../../styles/Colors";

interface ActionModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onAction: () => void;
  title: string;
  bullets: string[];
  summaryText: string;
  footerText: string;
  buttonText?: string;
}

const ActionModal: React.FC<ActionModalProps> = ({
  visible,
  onRequestClose,
  onAction,
  title,
  bullets,
  summaryText,
  footerText,
  buttonText = "Ver veterinarios",
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      >
        <View
          backgroundColor="white"
          br40
          width="90%"
          paddingV-20
          paddingH-20
        >
          {/* Header */}
          <View row spread centerV marginB-10>
            <TouchableOpacity onPress={onRequestClose}>
              <MaterialIcons name="arrow-back-ios" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>

          {/* Title and Icon Row */}
          <View row spread centerV marginB-15>
            <Text text60BO color={Colors.black} style={{ flex: 1, marginRight: 10 }}>
              {title}
            </Text>
            <Image
              source={require("../../assets/images/tobiIconModal.png")}
              style={{ width: 90, height: 60, resizeMode: 'contain' }}
            />
          </View>

          <View style={{ height: 1, backgroundColor: Colors.secondGray, marginBottom: 15 }} />

          {/* Bullets */}
          <View marginB-20>
            {bullets.map((bullet, index) => (
              <View row marginB-10 key={index}>
                <Text text80M color={Colors.black} marginR-5>
                  •
                </Text>
                <Text text80M color={Colors.black} style={{ flex: 1 }}>
                  {bullet}
                </Text>
              </View>
            ))}
          </View>

          {/* Summary Text */}
          <Text text80BO color={Colors.black} marginB-20>
            {summaryText}
          </Text>

          {/* Footer Text */}
          <Text text90M color={Colors.grey30} marginB-20 center>
            {footerText}
          </Text>

          {/* Action Button */}
          <Button
            label={buttonText}
            backgroundColor={Colors.primaryColor}
            borderRadius={12}
            size="large"
            style={{ width: "100%" }}
            onPress={onAction}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ActionModal;
