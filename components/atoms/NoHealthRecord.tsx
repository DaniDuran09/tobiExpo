import { View, Text } from "react-native-ui-lib";
import React from "react";
import { Colors } from "../../styles/Colors";
import { NoHealthRecordProps } from "./types";

const NoHealthRecord: React.FC<NoHealthRecordProps> = ({
  title = "",
  description = "",
  buttonText = "",
}) => {
  return (
    <View flex paddingH-5 paddingV-10 centerH spread>
      <Text text70BO color={Colors.white} center>
        {title}
      </Text>
      <Text text100L color={Colors.white} center>
        {description}
      </Text>
      <View backgroundColor={Colors.black} paddingH-20 paddingV-5 br30>
        <Text text100BO color={Colors.primaryColor}>
          {buttonText}
        </Text>
      </View>
    </View>
  );
};

export default NoHealthRecord;
