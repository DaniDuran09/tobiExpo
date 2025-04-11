import React from "react";
import { View, TabController } from "react-native-ui-lib";
import { Colors } from "../../../../styles/Colors";
import HealthTabControllerProps from "./types";

const HealthTabController: React.FC<HealthTabControllerProps> = ({
  initialIndex = 0,
  firstPage = <View />,
  secondPage = <View />,
}) => {
  return (
    <View style={{ height: "100%" }}>
      <TabController
        initialIndex={initialIndex}
        items={[{ label: "Vacunas" }, { label: "Desparacitaciones" }]}
      >
        <TabController.TabBar
          indicatorInsets={50}
          indicatorStyle={{ backgroundColor: Colors.primaryColor }}
          containerStyle={{ height: 50 }}
          selectedLabelColor={Colors.primaryColor}
        />
        <View flex>
          <TabController.TabPage index={0}>
            <View>{firstPage}</View>
          </TabController.TabPage>
          <TabController.TabPage index={1} lazy>
            <View>{secondPage}</View>
          </TabController.TabPage>
        </View>
      </TabController>
    </View>
  );
};

export default HealthTabController;
