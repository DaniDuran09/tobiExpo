import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../../styles/Colors';
import HeaderTitle from '../../../components/HeaderTitle';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {useDispatch, useSelector} from 'react-redux';
import { setPetInfo } from "../../../redux/slice/petSlice";

const SecondScreenRegisterPet = props => {
  const {pet} = props;
  const petInfo = useSelector(store => store.pet.info)

  const dispatch = useDispatch()


  const [petBreed, setPetBreed] = useState({
    id: 0,
    name: '',
  });
  const [petSize, setPetSize] = useState({
    name: '',
  });
  const [sterilized, setSterilized] = useState(false);
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    const updatedInfo = {
      ...petInfo,
      pet_breed_id: petBreed.id,
      weight: weight ? parseInt(parseFloat(weight) * 1000) : 0,
      sterilized: sterilized,
    };
  
    dispatch(setPetInfo(updatedInfo));
  }, [petBreed, sterilized, weight]);

  const navigation = useNavigation();

  const goToSearchItem = async type => {
    navigation.navigate('SearchItem', {
      type: type,
      setValue: setValue,
      id: pet,
      screen: 2,
    });
  };

  const setValue = value => {
    console.log("ENTRO :", value)
    setPetBreed(value);
    petInfo.pet_breed_id = value.id;
    setPetSize(value.pet_size);
    console.log("Lo hago todo bien")
    navigation.goBack();
  };

  // useEffect(() => {
  //   console.log('La info: ', petInfo);
  // }, [petInfo]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1, flexDirection: 'column'}}
        behavior={'height'}
        enabled>
        <ScrollView>
          <HeaderTitle title={'Tu mascota | Cuéntanos más'} />
          <View style={styles.containerForm}>
            <TouchableOpacity
              style={styles.textInput}
              onPress={() => goToSearchItem('pets_breeds')}>
              <Text>{petBreed.name == '' ? 'Raza' : petBreed.name}</Text>
            </TouchableOpacity>
            <View style={styles.textInput}>
              <Text>
                {petSize.name == '' ? 'Tamaño de la mascota' : petSize.name}
              </Text>
            </View>
            <TextInput
              placeholder="Peso de tu mascota (Kg)"
              placeholderTextColor="#000"
              keyboardType="number-pad"
              style={styles.textInput}
              onChangeText={text => {
                setWeight(text)
              }}
            />
            <View style={[styles.textInput, styles.moreStyles]}>
              <BouncyCheckbox
                size={20}
                fillColor="#EF4136"
                iconStyle={{borderColor: 'red'}}
                innerIconStyle={{borderWidth: 2}}
                disableText={true}
                onPress={item => {
                  setSterilized(item);
                }}
              />
              <Text style={styles.question}>
                ¿Tu mascota está esterilizada?
              </Text>
            </View>
            {/* <View style={styles.containerImage}>
              <Image
                source={require("../../../assets/step2.png")}
                style={{
                  height: 120,
                  width: "90%",
                }}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.buttonNext}
                onPress={goToNextStep}
              >
                <Text style={styles.textNext}>Siguiente</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SecondScreenRegisterPet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  containerForm: {},
  textInput: {
    width: '100%',
    height: 60,
    borderRadius: 4,
    paddingLeft: 20,
    backgroundColor: Colors.lightBlue,
    marginTop: '8%',
    justifyContent: 'center',
  },
  containerImage: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '10%',
  },
  buttonNext: {
    marginTop: 30,
    height: 60,
    width: '100%',
    minWidth: 400,
    backgroundColor: '#EF4136',
    borderRadius: 65,
    justifyContent: 'center',
  },
  textNext: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
  question: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: '#000',
    marginLeft: 20,
  },
  moreStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'flex-start',
  },
});
