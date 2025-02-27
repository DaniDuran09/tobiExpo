import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Colors } from '../../styles/Colors';
import ApiFetcher from '../../modules/ApiFetcher';
import Loading from '../../components/Loading';
import Toast from 'react-native-toast-message';
import ScreenInternetError from '../../components/ScreenInternetError';

const { width } = Dimensions.get('window');

interface BlogItem {
  name: string;
  description: string;
  url: string;
  picture: string;
}

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
        type: 'error',
        text1: 'Error',
        text2: 'No hemos podido obtener la información. Por favor, intenta nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: BlogItem }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('WebView', { url: item.url })}
    >
      <View style={[styles.elevation, { width: '100%', alignItems: 'center' }]}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: item.picture }} style={{ height: 60, width: 60, borderRadius: 100 }} resizeMode="cover" />
          </View>
          <View style={{ width: '95%', marginVertical: 20 }}>
            <View style={{ width: '80%', paddingTop: 10, marginLeft: 15 }}>
              <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold', paddingBottom: 5 }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#000' }}>{item.description}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading textColor={Colors.primaryColor} backgroundColorProp={Colors.white} />
      ) : error ? (
        <ScreenInternetError action={fetchBlogs} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `blog-${index}`}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchBlogs} />}
        />
      )}
    </SafeAreaView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: Colors.white,
  },
  text: {
    fontSize: 11,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
  },
  elevation: {
    backgroundColor: '#fff',
    shadowColor: '#000000',
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  hr: {
    borderTopWidth: 1,
    borderColor: '#D4D6DD',
    marginVertical: 20,
    width: '100%',
    height: 1,
    backgroundColor: '#D4D6DD',
    alignSelf: 'center',
  },
});
