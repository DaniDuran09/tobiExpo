import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Platform,
  Alert,
  RefreshControl,
  Linking,
} from 'react-native';
import {getBlog} from '../services';
import {Colors} from '../styles/Colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppStorage from '../modules/AppStorage';
import Loading from '../components/Loading';
import Toast from 'react-native-toast-message';
import ScreenServerError from '../components/ScreenServerError';

const {width, height} = Dimensions.get('window');

const DetailsScreen = ({navigation}) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = useState(false);
  // const { token } = useSelector((store) => store.general.user);

  const appStorage = new AppStorage();

  React.useEffect(() => {
    blog();
  }, []);

  const blog = async () => {
    try {
      const token = await appStorage.getAppToken();
      const blogData = await getBlog(token);

      if (blogData) setData(blogData.data);
    } catch (error) {
      // Alert.alert("Sucesió un error!", "Error")
      setError(true);
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `No hemos podido obtener la información`,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderItem = item => {
    //console.log('pet', item.picture)
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('WebView', {
            url: item.url,
          })
        }>
        <View style={[styles.elevation, {width: '100%', alignItems: 'center'}]}>
          <View style={{width: '100%', flexDirection: 'row'}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: item.picture}}
                style={{height: 60, width: 60, borderRadius: 100}}
                resizeMode="cover"
              />
            </View>
            <View style={{width: '95%', marginVertical: 20}}>
              <View style={{width: '80%', paddingTop: 10, marginLeft: 15}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#000',
                    fontWeight: 'bold',
                    paddingBottom: 5,
                  }}>
                  {item.name}
                </Text>
                <Text style={{fontSize: 12, color: '#000'}}>
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
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      {error ? (
        <ScreenServerError refetch={blog}/>
        // <ScreenInternetError action={blog}/>
      ) : (
        <View style={{width: width, height: '80%'}}>
          <FlatList
            // numColumns={3}
            keyExtractor={(item, index) => `item-${index}`}
            data={data}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={loading}
                onRefresh={blog}
              />
            }
            renderItem={({item}) => renderItem(item)}
          />
        </View>
      )}
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
    shadowOffset: {width: 0, height: 2},
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
