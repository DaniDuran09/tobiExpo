import React, {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Platform,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
// import * as Animatable from 'react-native-animatable';
// import { LinearGradient } from 'expo-linear-gradient';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Feather from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-date-picker';
import {Colors} from '../styles/Colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {setUserInfo} from '../redux/slice/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {formatDateToDDMMYYYY} from '../utils/scripts';

// import { useDispatch, useSelector } from 'react-redux';
// import { generalDataAction } from '../redux/generalDuck';

const SignInPetScreen = props => {
  const {user, data, setData} = props;

  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);

  const [pet, setPet] = React.useState(1);
  const [gender, setGender] = React.useState('male');

  const userInfo = useSelector(store => store.user.userInfo);

  const dispatch = useDispatch();

  useEffect(() => {
    selectPet(1)
  }, [])
  

  const selectPet = val => {
    setPet(val);
    setData({...data, typePet: val});
  };

  const selectGender = val => {
    setGender(val);
  };

  useEffect(() => {
    const updatedInfo = {
      ...userInfo,
      pet: [
        {
          name: data.namePet,
          last_name: '',
          age: formatDateToDDMMYYYY(date),
          birthday: formatDateToDDMMYYYY(date)
        },
      ],
    };
    dispatch(setUserInfo(updatedInfo));
  }, [data, gender, date]);

  useEffect(()=>{
    setData({...data, gender: gender})
  },[gender])

  

  const onSubmit = () => {
    // const petDta = {
    //   name: data.namePet.toString(),
    //   typePet: pet,
    //   gender: gender,
    //   birthday: data.birthday,
    // };
    // if ((data.birthday === "" || data.namePet === "")) {
    //   Alert.alert("Tobi", "Debes llenar todos los campos", [
    //     { text: "OK", onPress: () => null },
    //   ]);
    // } else {
    //   navigation.navigate("SignInPetInfoScreen", { pet: petDta, user: user });
    // }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
        behavior={Platform.OS == 'ios' && 'height'}
        enabled>
        <ScrollView>
          <View
            style={{
              alignItems: 'flex-start',
              paddingLeft: 20,
              
            }}>
            <Image
              source={require('../assets/frame.png')}
              style={{height: 80, width: 150, marginTop: 25}}
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
              Tu mascota | Quién es
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="Nombre de la mascota"
              placeholderTextColor="#000"
              elevation={5}
              style={styles.textInput}
              autoCapitalize="none"
              value={data.name}
              onChangeText={val => setData({...data, name: val})} 
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '102%',
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: '5%',
              }}>
              <TouchableWithoutFeedback onPress={() => selectPet(1)}>
                <View
                  elevation={5}
                  style={{
                    flexDirection: 'row',
                    width: '48%',
                    height: 50,
                    // backgroundColor: pet === 1 ? "#EF4136" : "white",
                    backgroundColor: Colors.white,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      pet == 1
                        ? require('../assets/selected-dog.png')
                        : require('../assets/dog.png')
                    }
                    style={{height: 30, width: 30}}
                    resizeMode={'contain'}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 15,
                      color: 'black',
                      fontWeight: pet == 1 ? '700' : '500',
                      marginLeft: 5,
                    }}>
                    Perro
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => selectPet(2)}>
                <View
                  elevation={5}
                  style={{
                    flexDirection: 'row',
                    width: '48%',
                    height: 50,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      pet == 2
                        ? require('../assets/selected-cat.png')
                        : require('../assets/cat.png')
                    }
                    style={{height: 25, width: 25}}
                    resizeMode={'contain'}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 15,
                      color: 'black',
                      fontWeight: pet == 2 ? '700' : '500',
                      marginLeft: 5,
                    }}>
                    Gato
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '102%',
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: '5%',
              }}>
              <TouchableWithoutFeedback onPress={() => selectGender('male')}>
                <View
                  elevation={5}
                  style={{
                    flexDirection: 'row',
                    width: '48%',
                    height: 50,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      gender == 'male'
                        ? require('../assets/selected-gender-M.png')
                        : require('../assets/gender-M.png')
                    }
                    style={{height: 30, width: 30}}
                    resizeMode={'contain'}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 15,
                      color: 'black',
                      fontWeight: gender === 'male' ? '700' : '500',

                      marginLeft: 5,
                    }}>
                    Macho
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => selectGender('female')}>
                <View
                  elevation={5}
                  style={{
                    flexDirection: 'row',
                    width: '48%',
                    height: 50,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      gender == 'female'
                        ? require('../assets/selected-gender-H.png')
                        : require('../assets/gender-H.png')
                    }
                    style={{height: 25, width: 25}}
                    resizeMode={'contain'}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 15,
                      color: 'black',
                      fontWeight: gender === 'female' ? '700' : '500',
                      marginLeft: 5,
                    }}>
                    Hembra
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <TouchableWithoutFeedback elevation={5} onPress={() => setOpen(true)}>
              <View
                style={{
                  width: '90%',
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: '5%',
                  borderRadius: 4,
                  height: 60,
                  marginTop: '5%',
                }}>
                <DatePicker
                  modal
                  open={open}
                  date={date}
                  onConfirm={date => {
                    setOpen(false);
                    setData({...data, birthday: date});
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                  locale={'es'}
                  mode={'date'}
                  title={'Cumpleaños'}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 15,
                    color: 'black',
                    paddingVertical: 10,
                  }}>
                  {data.birthday === ''
                    ? 'Cumpleaños'
                    : `${data?.birthday.toLocaleDateString('es-us')}`}
                </Text>
                <Image
                  source={require('../assets/pastel.png')}
                  style={{height: 30, width: 30}}
                  resizeMode={'contain'}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignInPetScreen;

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red"
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
    height: 60,
    width: '90%',
    borderRadius: 4,
    paddingLeft: 20,
    backgroundColor: Colors.white,
    marginTop: '8%',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
});
