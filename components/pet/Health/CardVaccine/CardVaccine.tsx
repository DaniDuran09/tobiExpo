import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import React from "react";
import { Dimensions } from "react-native";
import { Colors } from "../../../../styles/Colors";
import momentTZ from "../../../../utils/moment";
import Button from "../../../atoms/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CardVaccine: React.FC<CardVaccineProps> = ({
  item,
  setIdEditPet,
  idEditPet,
}) => {
  return (
    <View
      width={Dimensions.get("window").width * 0.86}
      height={270}
      br40
      padding-15
      backgroundColor={Colors.lightBlue}
      spread
      marginR-10
      style={{
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View row spread>
        <View>
          <Text text70BO>{item.name}</Text>
          <Text text90L>{item.description}</Text>
        </View>
        <TouchableOpacity onPress={() => setIdEditPet(item.id)}>
          <Icon name="pencil-outline" size={20} color={Colors.gray} />
        </TouchableOpacity>
      </View>
      <View row spread>
        <Text text70>Aplicación: </Text>
        <View row gap-10 centerV>
          <Text text70BL>
            {item.applied
              ? momentTZ(item.application_day).format("DD.MM.YYYY")
              : "No aplicada"}
          </Text>
          <TouchableOpacity disabled>
            <Icon name="calendar" size={20} color={Colors.gray} />
          </TouchableOpacity>
        </View>
      </View>
      <View row spread>
        <Text text70>Marca: </Text>
        <Text text70BO color={Colors.blueLight}>
          {item.brand}
        </Text>
      </View>
      <View row spread>
        <Text text70>Vence: </Text>
        <Text text70BL color={item.applied ? Colors.green : Colors.gray}>
          {item.applied
            ? momentTZ(item.next_dose).format("DD.MM.YYYY")
            : "--.--.--"}
        </Text>
      </View>
      {idEditPet === item.id ? (
        <View row spread>
          <Button
            label="Cancelar"
            variant="outline"
            onPress={() => setIdEditPet(null)}
          />
          <Button
            label="Confirmar"
            //   disabled={true}
            variant="primary"
            bgColor={Colors.primaryColor}
            onPress={() => {}}
          />
        </View>
      ) : (
        <View height={25} />
      )}
    </View>
  );
};

export default CardVaccine;
