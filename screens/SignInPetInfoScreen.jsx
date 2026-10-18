import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../styles/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import ViewLoading from '../components/ViewLoading';
import {useNavigation} from '@react-navigation/native';
import {setUserInfo} from '../redux/slice/userSlice';
import * as Notifications from 'expo-notifications';

const SignInPetInfoScreen = props => {
  const {pet, user, setData} = props;
  const [selectedBrand, setSelectedBrand] = useState(pet?.pet_breed || {});
  const [selectedActivity, setSelectedActivity] = useState(1);
  const dispatch = useDispatch();

  const [check, setCheck] = useState(pet?.sterilized || false);
  const initialWeight = pet?.weight ? (pet.weight > 100 ? String(pet.weight / 1000) : String(pet.weight)) : "";
  const [weight, setWeight] = useState(initialWeight);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [token, setToken] = useState(" ");

  const userInfo = useSelector(store => store.user.userInfo);

  useEffect(() => {
    getPushToken();
  }, []);
    
  const getPushToken = async () => {
    const data2 = (await Notifications.getExpoPushTokenAsync({projectId:"f65ecfcd-2965-4845-874e-f1581e444da1"})).data;
    setToken(data2);
  };

  useEffect(() => {
    if (!token || token.trim() === "") return;
    const breedId = selectedBrand?.id || pet?.pet_breed_id || 0;
    const calcWeight = weight ? parseInt(parseFloat(weight) * 1000) : 0;
    const updatedInfo = {
      ...userInfo,
      expotoken: token,
      pet:
        {
          ...pet,
          weight: calcWeight,
          activity_level_id: selectedActivity,
          pet_breed_id: breedId,
          sterilized: check,
        },
    };
    dispatch(setUserInfo(updatedInfo));
    setData(prev => ({
      ...prev,
      weight: calcWeight,
      pet_breed_id: breedId,
      pet_breed: selectedBrand?.id ? selectedBrand : prev?.pet_breed,
      sterilized: check,
    }));
  }, [check, selectedBrand, weight, token]);

  const goToSearchItem = async type => {
    navigation.navigate('SearchItem', {
      type: type,
      setValue: setValue,
      id: pet.typePet,
      screen: 1,
    });
  };

  const setValue = value => {
    setSelectedBrand(value);
    const breedId = value?.id || value;
    setData(prev => ({ ...prev, pet_breed_id: breedId, pet_breed: value }));
    navigation.goBack();
  };

  return (
    <>
      {loading ? (
        <ViewLoading
          waitString="Espere"
          backgroundColor={Colors.secondaryColor}
        />
      ) : (
        <View
          style={styles.container}>
          {/* <ModalSearch /> */}
          <KeyboardAvoidingView
            style={{flex: 1, flexDirection: 'column'}}
            behavior={Platform.OS == 'ios' && "height"}
            enabled>
              <ScrollView>
            <View
              style={{
                width: '100%',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
                paddingLeft: 20,
              }}>
              <Image
                source={require('../assets/frame.png')}
                style={{height: 80, width: 150, marginTop: 10}}
                resizeMode={'contain'}
              />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '900',
                  textAlign: 'center',
                  color: '#EF4136',
                  marginTop: 20,
                }}>
                Registro
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontSize: 20,
                  fontWeight: '500',
                  textAlign: 'center',
                  color: '#EF4136',
                  marginTop: 20,
                }}>
                Tu mascota | Cuéntanos más
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableWithoutFeedback
                onPress={() => goToSearchItem('pets_breeds')}>
                <View
                  elevation={5}
                  style={{
                    height: 60,
                    width: '90%',
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    paddingLeft: 20,
                    borderRadius: 4,
                    marginTop: '8%',
                  }}>
                  <Text
                    style={{color: 'black', fontWeight: '400', fontSize: 16}}>
                    {selectedBrand?.name ? selectedBrand?.name : 'Raza'}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View
                elevation={5}
                style={{
                  height: '15%',
                  width: '90%',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  paddingLeft: 20,
                  borderRadius: 4,
                  height: 60,
                  marginTop: '8%',
                }}>
                <Text style={{color: 'black', fontWeight: '400', fontSize: 16}}>
                  {selectedBrand?.name
                    ? selectedBrand?.pet_size?.name
                    : 'Tamaño de la mascota'}
                </Text>
              </View>
              <TextInput
                placeholder="¿Cuánto pesa tu mascota?"
                placeholderTextColor="#000"
                elevation={5}
                style={styles.textInput}
                autoCapitalize="none"
                keyboardType="numeric"
                value={weight}
                onChangeText={val => setWeight(val)}
              />

              <View style={[styles.textInput]}>
                <View style={{flexDirection: 'row'}}>
                  <BouncyCheckbox
                    isChecked={check}
                    size={20}
                    fillColor="#EF4136"
                    iconStyle={{borderColor: 'red'}}
                    innerIconStyle={{borderWidth: 2}}
                    textStyle={{
                      fontSize: 16,
                      fontWeight: '400',
                      color: '#000',
                    }}
                    onPress={item => {
                      setCheck(item);
                    }}
                  />
                  <Text>¿Tu mascota está esterilizada?</Text>
                </View>
              </View>
            </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      )}
    </>
  );
};

export default SignInPetInfoScreen;

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    width: '90%',
    height: 60,
    borderRadius: 4,
    paddingLeft: 20,
    backgroundColor: Colors.white,
    marginTop: '8%',
    justifyContent: 'center',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
