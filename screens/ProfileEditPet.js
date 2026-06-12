import React from 'react';
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
import DatePicker from 'react-native-date-picker'

const ProfileEditPet = ({ route, navigation, }) => {

    const { item } = route.params;

    const [date, setDate] = React.useState(new Date())
    const [open, setOpen] = React.useState(false)
    const [data, setData] = React.useState({
        birthday: ''
    });

    const [pet, setPet] = React.useState(1);
    const [gender, setGender] = React.useState('M');

    const selectPet = (val) => {
        setPet(val)
    }

    const selectGender = (val) => {
        setGender(val)
    }

    const onSubmit = () => {
        const petDta = {
            name: item.name,
            last_name: item.last_name,
            age: item.age,
            typePet: pet,
            gender: gender,
            birthday: data.birthday,
        }
        if (data.birthday === '') {
            Alert.alert('Tobi', 'Debes llenar todos los campos', [
                { text: 'OK', onPress: () => null },
            ]);
        } else {
            navigation.navigate('ProfileEditPetInfo', { pet: petDta })
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior={'height'} enabled   >
            <ScrollView>
                <View style={{
                    backgroundColor: '#f2f2f2',
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
                        <Text style={{ fontSize: 23, fontWeight: '400', textAlign: 'center', color: '#EF4136' }}>¿Quién es tu mascota?</Text>
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <Image source={require('../assets/steperC2.png')} style={{ height: 50, width: '85%' }} resizeMode={'contain'} />
                        </View>
                    </View>
                    <View style={{ height: '40%', width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                            <TouchableWithoutFeedback onPress={() => selectPet(1)}>
                                <View elevation={5} style={{ flexDirection: 'row', width: '40%', height: 50, backgroundColor: pet === 1 ? '#EF4136' : '#D6EFFF', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                    <Image source={require('../assets/dog.png')} style={{ height: 30, width: 30 }} resizeMode={'contain'} />
                                    <Text style={{ textAlign: 'center', fontSize: 15, color: pet === 1 ? 'white' : 'black', fontWeight: '500', marginLeft: 5 }}>Perro</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => selectPet(2)}>
                                <View elevation={5} style={{ flexDirection: 'row', width: '40%', height: 50, backgroundColor: pet === 2 ? '#EF4136' : '#D6EFFF', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                    <Image source={require('../assets/cat.png')} style={{ height: 25, width: 25 }} resizeMode={'contain'} />
                                    <Text style={{ textAlign: 'center', fontSize: 15, color: pet === 2 ? 'white' : 'black', fontWeight: '500', marginLeft: 5 }}>Gato</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                            <TouchableWithoutFeedback onPress={() => selectGender('M')}>
                                <View elevation={5} style={{ flexDirection: 'row', width: '40%', height: 50, backgroundColor: gender === 'M' ? '#EF4136' : '#D6EFFF', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                    <Image source={require('../assets/gender.png')} style={{ height: 30, width: 30 }} resizeMode={'contain'} />
                                    <Text style={{ textAlign: 'center', fontSize: 15, color: gender === 'M' ? 'white' : 'black', fontWeight: '500', marginLeft: 5 }}>Macho</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => selectGender('H')}>
                                <View elevation={5} style={{ flexDirection: 'row', width: '40%', height: 50, backgroundColor: gender === 'H' ? '#EF4136' : '#D6EFFF', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                    <Image source={require('../assets/genderb.png')} style={{ height: 25, width: 25 }} resizeMode={'contain'} />
                                    <Text style={{ textAlign: 'center', fontSize: 15, color: gender === 'H' ? 'white' : 'black', fontWeight: '500', marginLeft: 5 }}>Hembra</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <TouchableWithoutFeedback onPress={() => setOpen(true)}>
                            <View elevation={5} style={{ width: '90%', backgroundColor: '#D6EFFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '5%', borderRadius: 10 }}>
                                <DatePicker
                                    modal
                                    open={open}
                                    date={date}
                                    onConfirm={(date) => {
                                        setOpen(false)
                                        setData({ ...data, birthday: date })
                                    }}
                                    onCancel={() => {
                                        setOpen(false)
                                    }}
                                    locale={'es'}
                                    mode={'date'}
                                    title={'Cumpleaños'}
                                />
                                <Text style={{ textAlign: 'center', fontSize: 15, color: 'black', fontWeight: '500', paddingVertical: 10 }}>{data.birthday === '' ? 'Cumpleaños' : `${data?.birthday.toLocaleDateString('es-us')}`}</Text>
                                <Image source={require('../assets/pastel.png')} style={{ height: 30, width: 30 }} resizeMode={'contain'} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ height: '27%', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableWithoutFeedback onPress={onSubmit}>
                            <View elevation={5} style={{ height: 50, width: '80%', backgroundColor: '#EF4136', borderRadius: 10, justifyContent: 'center', marginBottom: 20 }}>
                                <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: '700' }}>Siguiente</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ProfileEditPet;

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
        backgroundColor: '#fff',
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
