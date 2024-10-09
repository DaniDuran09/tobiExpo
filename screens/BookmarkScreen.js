import React, { useState } from 'react';
import {
    View,
    Text,
    RefreshControl,
    Platform,
    StyleSheet,
    FlatList,
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

import { useDispatch, useSelector } from 'react-redux';
// import { generalDataAction } from '../redux/generalDuck';

import { getCards, cardDelete } from '../services';

const BookmarkScreen = ({ navigation }) => {

    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [create, setCreate] = React.useState(true)
    const { token } = useSelector(store => store.general.user)
    const update = useSelector(store => store?.general?.update)

    React.useEffect(() => {
        cards()
    }, [update]);

    const cards = () => {
        getCards(token)
            .then((response) => {
                
                if (response.data.length === 0) {
                    setData([])
                    setCreate(true)
                    setLoading(false)
                    return;
                } else {
                    const array = []
                    array.push(response.data[0])
                    setData(array)
                    setCreate(false)
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log('err', err)
                Alert.alert('Sucedio un error!', 'El servicio no esta disponible', [
                    { text: 'OK', onPress: () => setLoading(false) },
                ]);
            })
    }

    const onSubmit = () => {
        navigation.navigate('CreateCard')
    }

    const deletePet = (item) => {
        setLoading(true)
        cardDelete(token, item.id)
            .then((response) => {
                //console.log('response:::::', response.data)
                cards()
            })
            .catch((err) => {
                console.log('cardDelete:::::', err)
                Alert.alert('Sucedio un error!', 'El servicio no esta disponible', [
                    { text: 'OK', onPress: () => setLoading(false) },
                ]);
            })
    }

    const renderItem = (item) => {
        //console.log('pet', item)
        const str = item.card_number;
        const n = 4;
        const cardN = str.substring(str.length - n)
        return (
            <TouchableWithoutFeedback onPress={() => null}>
                <View style={{ height: 80, width: '100%', backgroundColor: 'yellow', flexDirection: 'row', backgroundColor: 'white' }}>
                    <View style={{ height: '100%', width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={item.brand === 'visa' ? require('../assets/visa.png') : item.brand === 'mastercard' ? require('../assets/mastercard.png') : require('../assets/discover.png')} style={{ height: 30, width: 30 }} resizeMode={'contain'} />
                    </View>
                    <View style={{ height: '100%', width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>{`xxxx xxxx xxxx ${cardN}`}</Text>
                        <Text style={{ fontSize: 16, color: 'black', fontWeight: '400' }}>{`${item.month}/${item.year}`}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => null}>
                        <View style={{ height: '100%', width: '15%', justifyContent: 'center', alignItems: 'center' }}>

                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => deletePet(item)}>
                        <View style={{ height: '100%', width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/basura.png')} style={{ height: 20, width: 20 }} resizeMode={'contain'} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    const emptyList = () => {
        return (
            <View style={{ height: 200, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#999', fontWeight: 'bold', fontSize: 18, }}>No tienes tarjeta registrada</Text>
            </View>
        )
    }

    return (
        <View style={{
            backgroundColor: '#f2f2f2', //#E6F8DB
            height: height / 1,
            width: width
        }}>
            
            <View style={{ height: '10%', width: '100%', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', backgroundColor: 'white' }}>
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/rigth.png')} resizeMode='contain' style={{ height: 25, width: 25 }} />
                </TouchableWithoutFeedback>
                <Text style={{ fontSize: 18, fontWeight: '400', textAlign: 'center', color: '#000' }}>Forma de pago</Text>
                <View style={{ height: 20, width: 20 }}>
                    <Text style={{ color: 'white' }}>.</Text>
                </View>
            </View>
            <View style={{ height: '13%', width: '100%', justifyContent: 'space-around', alignItems: 'flex-start', paddingLeft: 20 }}>
                <Text style={{ fontSize: 23, fontWeight: '400', textAlign: 'center', color: '#EF4136' }}>Selecciona o registra tu tarjeta</Text>
            </View>
            <View style={{ height: '50%', width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                <FlatList
                    // numColumns={3}
                    keyExtractor={(item, index) => `item-${index}`}
                    data={data}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 10 }} />
                    )}
                    ListEmptyComponent={({ item }) => emptyList(item)}
                    refreshControl={
                        <RefreshControl
                            //refresh control used for the Pull to Refresh
                            refreshing={loading}
                            onRefresh={cards}
                        />
                    }
                    renderItem={({ item }) => renderItem(item)}
                />
            </View>
            <View style={{ height: '27%', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                {create ? <TouchableWithoutFeedback onPress={onSubmit}>
                    <View style={{ height: 50, width: '80%', backgroundColor: '#EF4136', borderRadius: 10, justifyContent: 'center', marginBottom: 15 }}>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: '700' }}>Crear Tarjeta</Text>
                    </View>
                </TouchableWithoutFeedback> : null}
            </View>
        </View>
    );
};

export default BookmarkScreen;

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
