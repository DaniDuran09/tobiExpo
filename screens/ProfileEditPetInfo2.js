import React, { useEffect } from 'react';
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
    ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { generalDataAction, updateData } from '../redux/generalDuck';
import {
    CommonActions,
} from '@react-navigation/native';

import { createPet, foodTypes, foodBrandsService } from '../services';

const ProfileEditPetInfo2 = ({ route, navigation }) => {

    const update = useSelector(store => store.general.update)
    const dispatch = useDispatch();

    const [selectedLanguage, setSelectedLanguage] = React.useState('');
    const [selectedFoodBrand, setSelectedFoodBrand] = React.useState('');

    const pickerRef = React.useRef();
    const [peso, setPeso] = React.useState('');
    const [foodsType, setFoodsType] = React.useState([]);
    const [foodsBrands, setFoodsBrands] = React.useState([]);
    const [loading, setLoading] = React.useState(true)
    const [showModal, setShowModal] = React.useState(false)
    const [data, setData] = React.useState([])
    const [typePicker, setTypePicker] = React.useState('typeFood')

    const { token } = useSelector(store => store.general.user)
    const { info, pet, screen } = route.params;

    useEffect(() => {
        foodBrandsMethod()
    }, []);

    const foodType = (itemId) => {

        foodTypes(itemId)
            .then((response) => {
                //console.log('response', response.data)
                setFoodsType(response.data)
            })
            .catch((err) => {
                console.log('err', err)
                Alert.alert('Sucedio un error!', 'El servicio no esta disponible', [
                    { text: 'OK', onPress: () => setLoading(false) },
                ]);
            })
    }

    const foodBrandsMethod = () => {

        foodBrandsService()
            .then((response) => {
                //console.log('response', response.data)
                setFoodsBrands(response.data)
                setLoading(false)

            })
            .catch((err) => {
                console.log('err', err)
                Alert.alert('Sucedio un error!', 'El servicio no esta disponible', [
                    { text: 'OK', onPress: () => setLoading(false) },
                ]);
            })
    }

    const submitInfo = () => {
        const json = {
            "name": pet.name,
            "last_name": pet.last_name,
            "age": parseInt(pet.age),
            "pet_breed_id": info.pet_breed_id,
            "food_brand_id": Platform.OS === 'ios' ? selectedFoodBrand.id : selectedFoodBrand,
            "type_food_id": Platform.OS === 'ios' ? selectedLanguage.id : selectedLanguage,
            "activity_level_id": info.activity_level_id,
            "gender": pet.gender,
            "birthday": pet.birthday.toString(),
            "weight": parseInt(peso),
            "sterilized": info.sterilized
        }
        //console.log('::::::::JSON::::::::::::', json)
        if (selectedFoodBrand === '' || selectedLanguage === '' || peso === '') {
            Alert.alert('Tobi', 'Debes llenar todos los campos', [
                { text: 'OK', onPress: () => null },
            ]);
        } else {
            createPet(token, json)
                .then((response) => {
                    //console.log('response', response.data)
                    dispatch(updateData(!update))
                    // navigation.navigate('LoginScreen')
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                {
                                    name: 'Profile'
                                },
                            ],
                        })
                    );

                })
                .catch((err) => {
                    console.log('err', err.response)
                    Alert.alert('Sucedio un error!', 'El servicio no esta disponible', [
                        { text: 'OK', onPress: () => setLoading(false) },
                    ]);
                })
        }
    }


    const submitMe = (val) => {
        setShowModal(val)
    }

    const itemValue = (val, type) => {
        if (type === 'typeFood') {
            setSelectedLanguage(val)
        } else {
            setSelectedFoodBrand(val)
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior={'height'} enabled   >
            <ScrollView>
                <View style={{
                    backgroundColor: '#f2f2f2', //#E6F8DB
                    height: height / 1,
                    width: width
                }}>
                    <View style={{ height: '10%', width: '100%', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', backgroundColor: 'white' }}>
                        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                            <Image source={require('../assets/rigth.png')} resizeMode='contain' style={{ height: 25, width: 25 }} />
                        </TouchableWithoutFeedback>
                        <Text style={{ fontSize: 18, fontWeight: '400', textAlign: 'center', color: '#000' }}>Registro mascota</Text>
                        <View style={{ height: 20, width: 20 }}>
                            <Text style={{ color: 'white' }}>.</Text>
                        </View>
                    </View>
                    <View style={{ height: '23%', width: '100%', justifyContent: 'space-around', alignItems: 'flex-start', paddingLeft: 20 }}>
                        <Text style={{ fontSize: 23, fontWeight: '400', textAlign: 'center', color: '#EF4136' }}>¿Cuál es su alimento?</Text>
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <Image source={require('../assets/steperC4.png')} style={{ height: 50, width: '85%' }} resizeMode={'contain'} />
                        </View>
                    </View>
                    <View style={{ height: '45%', width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                        
                        <TextInput
                            placeholder="Peso de tu mascota"
                            keyboardType='numeric'
                            elevation={5}
                            placeholderTextColor="#000"
                            style={[styles.textInput, {
                                color: "#000"
                            }]}
                            autoCapitalize="none"
                            onChangeText={(val) => setPeso(val)}
                        />
                    </View>
                    <View style={{ height: '22%', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableWithoutFeedback onPress={() => submitInfo()}>
                            <View style={{ height: 50, width: '80%', backgroundColor: '#EF4136', borderRadius: 10, justifyContent: 'center', marginBottom: 20 }}>
                                <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: '700' }}>Siguiente</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <ModalPicker active={showModal} typePicker={typePicker} data={data} submit={(val) => submitMe(val)} item={(val, type) => itemValue(val, type)} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ProfileEditPetInfo2;

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        width: '90%',
        height: 40,
        borderRadius: 10,
        paddingLeft: 20,
        justifyContent: 'center',
        backgroundColor: '#D6EFFF',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
