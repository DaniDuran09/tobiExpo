import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Alert,
    Dimensions,
    TouchableWithoutFeedback,
    Modal
} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { useDispatch, useSelector } from 'react-redux';
import SearchableDropdown from 'react-native-searchable-dropdown';

import { signIn as signInService, petBrands, activity } from '../services';

const ProfileEditPetInfo = ({ route, navigation }) => {

    const [selectedBrand, setSelectedBrand] = React.useState('');
    const [selectedActivity, setSelectedActivity] = React.useState('');
    const pickerRef = React.useRef();
    const pickerRefActivity = React.useRef();
    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });
    const dispatch = useDispatch();
    const { pet } = route.params;

    const [array, setArray] = React.useState([])
    const [activityPet, setActivityPet] = React.useState([])
    const [check, setCheck] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [modalSearch, setModalSearch] = React.useState(false)

    useEffect(() => {
        petBrand(pet.typePet)
    }, []);

    const petBrand = (type) => {
        petBrands(type)
            .then((response) => {
                setArray(response.data)
                activityLevel()
            })
            .catch((err) => {
                console.log('err', err)
                Alert.alert('Sucedio un error!', 'El servicio no esta disponible', [
                    { text: 'OK', onPress: () => setLoading(false) },
                ]);
            })
    }

    const activityLevel = () => {
        activity()
            .then((response) => {
                setActivityPet(response.data)
                setLoading(false)
            })
            .catch((err) => {
                console.log('err', err)
                setLoading(false)
                Alert.alert('Sucedio un error!', 'El servicio no esta disponible', [
                    { text: 'OK', onPress: () => setLoading(false) },
                ]);
            })
    }

    const submitInfo = () => {
        const info = {
            activity_level_id: selectedActivity,
            pet_breed_id: selectedBrand.id,
            sterilized: check
        }
        if (selectedBrand === '' || selectedActivity === '') {
            Alert.alert('Tobi', 'Debes llenar todos los campos', [
                { text: 'OK', onPress: () => null },
            ]);
        } else {
            navigation.navigate('ProfileEditPetInfo2', { info, pet })
        }
    }


    const ModalSearch = () => {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                onRequestClose={() => { }}
                visible={modalSearch}
                style={{ flex: 1 }} >
                <View style={{ width: width, height: height, alignItems: 'center', backgroundColor: 'white', paddingVertical: 20 }}>
                    <SearchableDropdown
                        onItemSelect={(item) => {
                            setSelectedBrand(item)
                            setModalSearch(false)
                        }}
                        containerStyle={{ padding: 5 }}
                        // onRemoveItem={(item, index) => {
                        //     const items = array.filter((sitem) => sitem.id !== item.id);
                        //     setSelectedItems(items);
                        // }}
                        itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            backgroundColor: '#EF4136',
                            borderColor: '#bbb',
                            borderWidth: 1,
                            borderRadius: 5,
                        }}
                        itemTextStyle={{ color: '#000' }}
                        itemsContainerStyle={{ maxHeight: height / 1.2 }}
                        items={array}
                        defaultIndex={2}
                        resetValue={false}
                        placeholderTextColor={'black'}
                        textInputProps={
                            {
                                placeholder: "Raza de perro",
                                underlineColorAndroid: "transparent",
                                style: {
                                    padding: 12,
                                    height: 50,
                                    width: width / 1.15,
                                    backgroundColor: '#F2F2F2',
                                    color: 'black'
                                },
                                // onTextChange: text => alert(text)
                            }
                        }
                        listProps={
                            {
                                nestedScrollEnabled: true,
                            }
                        }
                    />
                </View>
            </Modal>
        )
    }

    return (
        <View style={{
            backgroundColor: '#f2f2f2', //#E6F8DB
            height: height / 1,
            width: width
        }}>
            <ModalSearch />
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
                <Text style={{ fontSize: 23, fontWeight: '400', textAlign: 'center', color: '#EF4136' }}>Cuéntanos un poco más</Text>
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <Image source={require('../assets/steperC3.png')} style={{ height: 50, width: '85%' }} resizeMode={'contain'} />
                </View>
            </View>
            <View style={{ height: '45%', width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={() => setModalSearch(true)}>
                    <View elevation={5} style={{ height: '15%', width: '90%', backgroundColor: '#D6EFFF', justifyContent: 'center', paddingLeft: 20, borderRadius: 10 }}>
                        <Text style={{ color: 'black', fontWeight: '400', fontSize: 16 }}>{selectedBrand?.name ? selectedBrand?.name : 'Raza'}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <View elevation={5} style={{ height: '15%', width: '90%', backgroundColor: '#D6EFFF', justifyContent: 'center', paddingLeft: 20, borderRadius: 10 }}>
                    <Text style={{ color: 'black', fontWeight: '400', fontSize: 16 }}>{selectedBrand?.name ? selectedBrand?.pet_size?.name : 'Tamaño'}</Text>
                </View>
                <View elevation={5} style={styles.textInput}>
                   
                </View>

                <View elevation={5} style={[styles.textInput, { flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }]}>
                    <BouncyCheckbox
                        size={20}
                        fillColor="#EF4136"
                        text="¿Tu mascota está esterilizada?"
                        iconStyle={{ borderColor: "red" }}
                        innerIconStyle={{ borderWidth: 2 }}
                        textStyle={{ fontFamily: "JosefinSans-Regular" }}
                        disableText={true}
                        onPress={(item) => { setCheck(item) }}
                    />
                    <Text style={{ fontSize: 16, fontWeight: '400', textAlign: 'center', color: '#000', marginLeft: 20 }}>¿Tu mascota está esterilizada?</Text>
                </View>
            </View>
            <View style={{ height: '22%', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={submitInfo}>
                    <View style={{ height: 50, width: '80%', backgroundColor: '#EF4136', borderRadius: 10, justifyContent: 'center', marginBottom: 20 }}>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: '700' }}>Siguiente</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

export default ProfileEditPetInfo;

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
        paddingLeft: 10,
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