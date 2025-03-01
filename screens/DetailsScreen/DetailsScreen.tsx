// DetailsScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, SafeAreaView, StyleSheet } from 'react-native';
import ApiFetcher from '../../modules/ApiFetcher';
import Loading from '../../components/Loading';
import RenderItem from '../../components/renders/RenderItem';
import Toast from 'react-native-toast-message';
import ScreenInternetError from '../../components/ScreenInternetError';
import { BlogItem } from './types'; // Importar el tipo BlogItem desde 'types.ts'

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

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading textColor="#000" backgroundColorProp="#fff" />
      ) : error ? (
        <ScreenInternetError action={fetchBlogs} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `blog-${index}`}
          renderItem={({ item }) => <RenderItem item={item} navigation={navigation} />}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchBlogs} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default DetailsScreen;
