import { Image, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import { setServiceInfo } from "../../redux/slice/appointmentSlice";
import { useDispatch } from "react-redux";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";

const ServiceOption = ({
  service,
  picture,
  listService,
  users,
  partnerId,
  partnerLocation,
}: ServiceOptionProps) => {

  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const goToCreateDate = async () => {
    navigation.navigate("InfoServiceForDate", { 
      users: users,
      partnerId: partnerId,
      partnerLocation: partnerLocation,
    });
    dispatch(setServiceInfo(listService));
  };
  return (
    <View style={styles.containerOption}>
      <TouchableOpacity centerH onPress={goToCreateDate}>
        <Text text80M color={Colors.black} center>
          {service?.name}
        </Text>
        <Image
          source={{ uri: picture }}
          width={50}
          height={50}
          resizeMode={"contain"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ServiceOption;

const styles = StyleSheet.create({
  containerOption: {
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    width: "30%",
    height: "25%",
    borderRadius: 16,
    padding: 5,
  },
});
