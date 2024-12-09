import React, { useEffect, useState } from "react";
import { StyleSheet, Image, SafeAreaView, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Colors } from "../../styles/Colors";
import Health from "./health/Health";
import Welfare from "./welfare/Welfare";
import Weight from "./weight/Weight";
import WithoutPhoto from "../../components/WithoutPhoto";
import ApiFetcher from "../../modules/ApiFetcher";
import { Text, View } from "react-native-ui-lib";

const HomeProfileDetails = ({ route }) => {
  const { item, tabIndex } = route.params;

  const apiFetcher = new ApiFetcher();

  const [pet, setPet] = useState(null);
  const [index, setIndex] = useState(tabIndex);
  const [routes] = useState([
    { key: "first", title: "SALUD" },
    { key: "second", title: "BIENESTAR" },
    { key: "three", title: "PESO" },
  ]);

  useEffect(() => {
    fetchPet();
  }, []);

  const renderScene = SceneMap({
    first: () => <Health pet={item} />,
    second:  () => <Welfare pet={item} />,
    three: () => <Weight item={item} />,
  });

  const fetchPet = async () => {
    const response = await apiFetcher.getPetById(item.id);
    // console.log("response: ", response)
  };

 

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: Colors.primaryColor }}
      style={{ backgroundColor: Colors.white }}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            color: focused && Colors.primaryColor,
            fontSize: 10,
            fontWeight: focused ? "700" : "600",
          }}
        >
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <View flex padding-5 backgroundColor={Colors.white}>
      <View center marginT-5>
        {item.picture ? (
          <Image
            source={{ uri: item.picture }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
            }}
          />
        ) : (
          <WithoutPhoto />
        )}
      </View>
      <View padding-10>
        <Text text50BO>{item.name}</Text>
        <Text text80BO>{`${item.age} años | ${
          item.gender === "M" ? "Macho" : "Hembra"
        } | ${item.pet_breed.name}`}</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default HomeProfileDetails;
