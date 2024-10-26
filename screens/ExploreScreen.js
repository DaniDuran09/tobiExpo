import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  RefreshControl,
  ImageBackground,
  Alert,
} from "react-native";
import ApiFetcher from "../modules/ApiFetcher";

const { width, height } = Dimensions.get("window");

const ExploreScreen = ({ navigation }) => {
  const [data, setData] =useState([]);
  const [loading, setLoading] = useState(true);

  const apiFetcher = new ApiFetcher();

  useEffect(() => {
    partnerList();
  }, []);

  const partnerList = async () => {
    try {
      const partners = await apiFetcher.getPartners()
      setData(partners.data);
    } catch (error) {
      console.log("Error: ", error);
      Alert.alert("Ocurrió un error", "Vuelva a intentarlo más tarde");
    } finally {
      setLoading(false)
    }
  };

  const renderItem = (item) => {
    return (
      <View
        elevation={5}
        style={{
          height: 170,
          width: "100%",
          backgroundColor: "yellow",
          flexDirection: "row",
          backgroundColor: "white",
        }}
      >
        <ImageBackground
          source={{ uri: item.picture }}
          style={{ height: "100%", width: "100%" }}
          resizeMode="contain"
        >
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.4)",
              height: "100%",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                height: "65%",
                paddingHorizontal: 10,
                justifyContent: "space-around",
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 24 }}
              >
                {item.name}
              </Text>
              <Text style={{ color: "white", fontWeight: "400", fontSize: 24 }}>
                {item.type_partner.name}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                height: "35%",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingLeft: 15,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate("PartnersDetails", { item });
                }}
              >
                <View
                  style={{
                    height: 30,
                    width: "30%",
                    backgroundColor: "#EF4136",
                    borderRadius: 5,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      color: "white",
                      fontWeight: "400",
                    }}
                  >
                    {"more ->"}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: width / 1.1,
          height: "5%",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            color: "black",
            fontWeight: "700",
          }}
        >
          Partners
        </Text>
      </View>
      <View
        style={{
          width: width / 1.1,
          height: "90%",
          alignItems: "center",
          backgroundColor: "#f2f2f2",
          padding: 10,
          paddingBottom: 40,
        }}
      >
        <FlatList
          // numColumns={3}
          keyExtractor={(item, index) => `item-${index}`}
          data={data}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={loading}
              onRefresh={partnerList}
            />
          }
          renderItem={({ item }) => renderItem(item)}
        />
      </View>
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
  },
  text: {
    fontSize: 11,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
  },
  elevation: {
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
});
