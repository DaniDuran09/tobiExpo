import React, { useState, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";
import { View } from "react-native-ui-lib"; 
import { Colors } from "../../styles/Colors";
import ApiFetcher from "../../modules/ApiFetcher";
import Loading from "../../components/Loading";
import RenderItem from "../../components/renders/RenderItem";
import Toast from "react-native-toast-message";
import ScreenInternetError from "../../components/ScreenInternetError";
import { BlogItem } from "./types";

const DetailsScreen = ({ navigation }: { navigation: any }) => {
  const [data, setData] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const apiFetcher = new ApiFetcher();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogData = await apiFetcher.getBlogs();
      if (blogData) setData(blogData.data);
    } catch (err) {
      setError(true);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "No hemos podido obtener la información. Por favor, intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View backgroundColor={Colors.white} center>
      {loading ? (
        <Loading textColor={Colors.black} backgroundColorProp={Colors.white} />
      ) : error ? (
        <ScreenInternetError action={fetchBlogs} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(index) => `blog-${index}`}
          renderItem={({ item }) => {
            const { name, description, picture, url } = item;
            return (
              <RenderItem
                name={name}
                description={description}
                picture={picture}
                url={url}
                navigation={navigation}
              />
            );
          }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchBlogs} />
          }
        />
      )}
    </View>
  );
};

export default DetailsScreen;
