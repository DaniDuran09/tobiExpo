import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  RefreshControl,
} from 'react-native';
import { Colors } from '../styles/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Loading from '../components/Loading';
import Toast from 'react-native-toast-message';
import { useGetBlogsQuery } from '../api/tobiApi/user';

const { width } = Dimensions.get('window');

const DetailsScreen = ({ navigation }) => {
  const { data: blogsResponse, error, isLoading, refetch } = useGetBlogsQuery()

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: `No hemos podido obtener la información`,
    });
  }

  const renderItem = item => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('WebView', {
            url: item.url,
          })
        }>
        <View style={[styles.elevation, { width: '100%', alignItems: 'center' }]}>
          <View style={{ width: '100%', flexDirection: 'row' }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={{ uri: item.picture }}
                style={{ height: 60, width: 60, borderRadius: 100 }}
                resizeMode="cover"
              />
            </View>
            <View style={{ width: '95%', marginVertical: 20 }}>
              <View style={{ width: '80%', paddingTop: 10, marginLeft: 15 }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#000',
                    fontWeight: 'bold',
                    paddingBottom: 5,
                  }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 12, color: '#000' }}>
                  {item.description}
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <View style={{ width: width, height: '80%' }}>
        <FlatList
          keyExtractor={(item, index) => `item-${index}`}
          data={blogsResponse?.data ?? []}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
            />
          }
          renderItem={({ item }) => renderItem(item)}
        />
      </View>
    </View>
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
    marginVertical: 20,
    alignSelf: 'center',
  },
});
