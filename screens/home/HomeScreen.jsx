import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  RefreshControl,
  SafeAreaView,
  Alert,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar} from 'react-native-paper';
import {Colors, gradientColors} from '../../styles/Colors';
import AppStorage from '../../modules/AppStorage';
import ApiFetcher from '../../modules/ApiFetcher';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import NoPetsHome from '../../components/NoPetsHome';
import { setUserInfo } from '../../redux/slice/userSlice';

const {width, height} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const user = useSelector(state => state.user.userInfo);
  const [pressCount, setPressCount] = useState(0);

  const dispatch = useDispatch();

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [userData, setUserData] = React.useState({});

  const apiFetcher = new ApiFetcher();
  const appStorage = new AppStorage();

  React.useEffect(() => {
    fetchDta();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDta()
      return () => {};
    }, [navigation])
  );

  const fetchDta = async () => {
    try {
      const list = await apiFetcher.getPets();
      if (list) setData(list.data);
      const user = await apiFetcher.getProfile();
      setUserData(user.data);
      dispatch(setUserInfo(user.data))
    } catch (e) {
      console.log('Error: ', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (pressCount === 0) {
        ToastAndroid.show('Presiona de nuevo para salir', ToastAndroid.SHORT);
        setPressCount(1);
        setTimeout(() => {
          setPressCount(0);
        }, 5000);
      } else if (pressCount === 1) {
        BackHandler.exitApp();
      }
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [pressCount]);

  const renderItem = item => {
    return (
      <View>
        <View
          style={{
            height: 70,
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Avatar.Image
            source={{
              uri: item?.picture,
            }}
            size={35}
            style={{backgroundColor: 'lightgrey'}}
          />
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: 'bold',
              paddingLeft: 15,
            }}>
            {item.name}
          </Text>
        </View>
        <View
          style={{
            height: 180,
            width: '100%',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <LinearGradient colors={gradientColors} style={styles.gradient}>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate('HomeProfileDetails', {item, tabIndex: 0})
              }>
              <View
                elevation={5}
                style={[
                  styles.elevation,
                  {
                    height: '98%',
                    width: '98%',
                    justifyContent: 'space-around',
                    paddingHorizontal: 10,
                  },
                ]}>
                <Text
                  style={{fontSize: 14, color: 'black', fontWeight: 'bold'}}>
                  SALUD
                </Text>
                <Text style={{fontSize: 12, color: 'black', fontWeight: '400'}}>
                  Próxima visita
                </Text>
                <Text
                  style={{fontSize: 14, color: 'black', fontWeight: 'bold'}}>
                  ---
                </Text>
                <Text style={{fontSize: 12, color: 'black', fontWeight: '400'}}>
                  Faltan
                </Text>
                <Text
                  style={{fontSize: 14, color: 'green', fontWeight: 'bold'}}>
                  ---
                </Text>
                <Text style={{fontSize: 14, color: 'black', fontWeight: '300'}}>
                  + info
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </LinearGradient>
          <LinearGradient colors={gradientColors} style={styles.gradient}>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate('HomeProfileDetails', {item, tabIndex: 1})
              }>
              <View
                elevation={5}
                style={[
                  styles.elevation,
                  {
                    height: '98%',
                    width: '98%',
                    justifyContent: 'space-around',
                    paddingHorizontal: 10,
                  },
                ]}>
                <Text
                  style={{fontSize: 14, color: 'black', fontWeight: 'bold'}}>
                  BIENESTAR
                </Text>
                <Text style={{fontSize: 12, color: 'black', fontWeight: '400'}}>
                  Recomendación
                </Text>
                <Text
                  style={{fontSize: 14, color: 'black', fontWeight: 'bold'}}>
                  ---
                </Text>
                <Text style={{fontSize: 14, color: 'black', fontWeight: '300'}}>
                  + info
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </LinearGradient>
        </View>
        <View
          style={{
            height: 180,
            width: '100%',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <LinearGradient colors={gradientColors} style={styles.gradient}>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate('HomeProfileDetails', {item, tabIndex: 2})
              }>
              <View
                elevation={5}
                style={[
                  styles.elevation,
                  {
                    height: '98%',
                    width: '98%',
                    justifyContent: 'space-around',
                    paddingHorizontal: 10,
                  },
                ]}>
                <Text
                  style={{fontSize: 14, color: 'black', fontWeight: 'bold'}}>
                  PESO
                </Text>
                <Text style={{fontSize: 12, color: 'black', fontWeight: '400'}}>
                  Rango ideal
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'black',
                    fontWeight: 'bold',
                  }}>{`${item?.weight_status?.ideal_weight?.from / 1000} Kg - ${item?.weight_status?.ideal_weight?.to / 1000} Kg`}</Text>
                <Text style={{fontSize: 12, color: 'black', fontWeight: '400'}}>
                  Real
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'red',
                    fontWeight: 'bold',
                  }}>{`${item.weight} Kg`}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {item.activity_level.stable ? null : (
                      <Image
                        source={require('../../assets/Polygon3.png')}
                        style={{height: 15, width: 15}}
                        resizeMode={'contain'}
                      />
                    )}
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'black',
                        fontWeight: '300',
                      }}>{`---------%`}</Text>
                  </View>
                  <Text
                    style={{fontSize: 14, color: 'black', fontWeight: '300'}}>
                    + info
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </LinearGradient>
          <TouchableWithoutFeedback
          /* onPress={() =>
              navigation.navigate("HomeProfileDetails", { item, tabIndex: 0 })
            }*/
          >
            <View elevation={5} style={styles.elevation}>
              <Text style={{fontSize: 14, color: 'grey', fontWeight: 'bold'}}>
                NUTRICIÓN
              </Text>
              {/*
              <Text style={{ fontSize: 12, color: "black", fontWeight: "400" }}>
                Ingesta diaria recomendada
              </Text>
              <Text
                style={{ fontSize: 14, color: "black", fontWeight: "bold" }}
              >
                ---
              </Text>
              <Text style={{ fontSize: 12, color: "black", fontWeight: "400" }}>
                Entre --- raciones al día
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.activity_level.stable ? null : <></>}
                  {/* <Text
                    style={{ fontSize: 14, color: "black", fontWeight: "300" }}
                  >{`${item.activity_level_status.percent}%`}</Text> 
                  <></>
                </View>
                <Text
                  style={{ fontSize: 14, color: "black", fontWeight: "300" }}
                >
                  + info
                </Text>
              </View>*/}
              <Text>PROXIMAMENTE...</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            height: 180,
            width: '100%',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableWithoutFeedback
          /*onPress={() =>
              navigation.navigate("HomeProfileDetails", { item, tabIndex: 3 })
            }*/
          >
            <View elevation={5} style={styles.elevation}>
              <Text style={{fontSize: 14, color: 'grey', fontWeight: 'bold'}}>
                ACTIVIDAD
              </Text>
              {/*
              <Text style={{ fontSize: 12, color: "black", fontWeight: "400" }}>
                Recomendación
              </Text>
              <Text
                style={{ fontSize: 14, color: "black", fontWeight: "bold" }}
              >{`${item.activity_level_status.steps} pasos`}</Text>
              <Text style={{ fontSize: 12, color: "black", fontWeight: "400" }}>
                ---
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: item.activity_level.stable ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {item.activity_level.steps}
              </Text>
               
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.activity_level.stable ? null : (
                    <Image
                      source={require("../../assets/Polygon.png")}
                      style={{ height: 15, width: 15, marginRight: 5 }}
                      resizeMode={"contain"}
                    />
                  )}
                  <Text
                    style={{ fontSize: 14, color: "black", fontWeight: "300" }}
                  >{`${item.activity_level_status.percent}%`}</Text>
                </View>
                <Text
                  style={{ fontSize: 14, color: "black", fontWeight: "300" }}
                >
                  + info
                </Text>
              </View>*/}
              <Text>PROXIMAMENTE...</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.navigate('HomeProfileDetails', {item, tabIndex: 2})
            }>
            <View style={{width: '45%'}}></View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: Colors.white}}>
      <View style={styles.container}>
        <View
          style={{
            width: width / 1.05,
            height: '15%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Avatar.Image
            source={{
              uri: userData.picture,
            }}
            size={60}
          />
          <View style={{paddingLeft: 15}}>
            <Text
              style={{
                fontSize: 24,
                color: '#EF4136',
                fontWeight: 'bold',
              }}>{`Hola ${user.name}`}</Text>
            <Text style={{fontSize: 24, color: '#EF4136', fontWeight: '400'}}>
              Buenos días
            </Text>
          </View>
        </View>
        <View style={{width: width / 1.1, height: '85%'}}>
          {data.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => `item-${index}`}
              data={data}
              ItemSeparatorComponent={() => <View style={{height: 10}} />}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => fetchDta()}
                  tintColor={Colors.primaryColor}
                  title="Loading..."
                  titleColor="black"
                  colors={['black', 'black', 'black']}
                  progressBackgroundColor="white"
                />
              }
              renderItem={({item}) => renderItem(item)}
            />
          ) : (
            <View style={styles.noPetsContainer}>
              <NoPetsHome/>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  gradient: {
    height: '95%',
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    border: 10,
  },
  container: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  text: {
    fontSize: 11,
  },
  elevation: {
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    height: '90%',
    width: '45%',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    backgroundColor: Colors.lightGray,
  },
  noPetsContainer: {
    height: '95%',
    justifyContent: 'center',
  },
  newPetButton: {
    alignSelf: 'center',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.black,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4%',
  },
  newPetText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {position: 'absolute', bottom: 10, width: '100%'},
});
