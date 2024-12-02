import React, { useState } from 'react';
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
// import * as Animatable from 'react-native-animatable';
// import { LinearGradient } from 'expo-linear-gradient';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Feather from 'react-native-vector-icons/Feather';

// import { useDispatch, useSelector } from 'react-redux';
// import { generalDataAction } from '../redux/generalDuck';

// import { signIn as signInService } from '../services';

const ProfileEdit = ({ navigation }) => {

    const [user, setUser] = useState({
        name: '',
        last_name: '',
        age: ''
    })

    const onSubmit = () => {
        if (user.name === '' || user.last_name === '' || user.age === '') {
            Alert.alert('Tobi', 'Debes llenar todos los campos', [
                { text: 'OK', onPress: () => null },
            ]);
        } else {
            navigation.navigate('ProfileEditPet', { item: user })
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
                        <Text style={{ fontSize: 23, fontWeight: '400', textAlign: 'center', color: '#EF4136' }}>¿Quién es tu mascota?</Text>
                        <View style={{width: '100%', alignItems:'center'}}>
                            <Image source={require('../assets/steperC.png')} style={{ height: 50, width: '85%' }} resizeMode={'contain'} />
                        </View>
                    </View>
                    <View style={{ height: '40%', width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                        <TextInput
                            placeholder="Nombre"
                            placeholderTextColor="#000"
                            elevation={5}
                            style={[styles.textInput, {
                                color: "#000"
                            }]}
                            autoCapitalize="none"
                            onChangeText={(val) => setUser({ ...user, name: val })}
                        />
                        <TextInput
                            placeholder="Apellido"
                            elevation={5}
                            placeholderTextColor="#000"
                            style={[styles.textInput, {
                                color: "#000"
                            }]}
                            autoCapitalize="none"
                            onChangeText={(val) => setUser({ ...user, last_name: val })}
                        />
                        <TextInput
                            keyboardType='numeric'
                            placeholder="Años"
                            elevation={5}
                            placeholderTextColor="#000"
                            maxLength={3}
                            style={[styles.textInput, {
                                color: "#000"
                            }]}
                            autoCapitalize="none"
                            onChangeText={(val) => setUser({ ...user, age: val })}
                        />
                    </View>
                    <View style={{ height: '27%', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableWithoutFeedback onPress={onSubmit}>
                            <View style={{ height: 50, width: '80%', backgroundColor: '#EF4136', borderRadius: 10, justifyContent: 'center', marginBottom: 15 }}>
                                <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: '700' }}>Siguiente</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </ScrollView >
        </KeyboardAvoidingView >
    );
};

export default ProfileEdit;

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
        height: 40,
        width: '90%',
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
