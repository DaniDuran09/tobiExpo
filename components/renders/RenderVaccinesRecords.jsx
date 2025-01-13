import React from "react";
import { Text, View } from "react-native-ui-lib";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import momentTZ from "../../utils/moment";
import { Colors } from "../../styles/Colors";

export default function RenderVaccinesRecords({ item }) {
  const { isCompleted, name, next_dose } = item;

  return (
    <View padding-10 row gap-10 centerV>
      <SimpleLineIcons
        name={isCompleted ? "check" : "close"}
        size={20}
        style={{
          color: item.isCompleted ? Colors.green : Colors.red,
        }}
      />
      <View>
        <Text text70>{name}</Text>
        <Text text90L>
          {item.isCompleted
            ? `Vencimiento ${momentTZ(next_dose).format("DD.MM.YYYY")}`
            : "Vencida"}
        </Text>
      </View>
    </View>
  );
}
