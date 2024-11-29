import { StyleSheet } from "react-native";
import { Image, RadioButton, Text, View } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";

export  const RenderServices = ({item, selectedServices, toggleServiceSelection}) => {
    const isChecked = selectedServices.includes(item);
    return (
      <View row spread marginB-40>
        <View>
          <Text text70BO>{item?.name}</Text>
          <View row spread gap-10 marginT-5>
            <Image source={require('../../assets/vet-option1.png')} style={styles.image} />
            <View>
              <Text>{item?.description}</Text>
              <View
                center
                padding-5
                width={80}
                marginT-10
                style={styles.priceContainer}
              >
                <Text text90BO color={Colors.primaryColor}>
                  ${item?.price}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <RadioButton label={''} color={Colors.primaryColor} selected={isChecked} onPress={() => toggleServiceSelection(item)} />
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    priceContainer: {
        borderWidth: 0.7,
        borderColor: Colors.primaryColor,
      },
      image: {
        width: 20,
        height: 20,
      },
  })