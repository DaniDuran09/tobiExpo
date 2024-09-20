import React from 'react';
import {
    View,
    Text,
    Modal,
    Dimensions,
    StyleSheet,
    Alert,
    Image,
    RefreshControl,
    TouchableWithoutFeedback,
    FlatList,
    ImageBackground,
    Platform
} from 'react-native';

import { Avatar } from 'react-native-paper';
import { getPartensId, payPartner } from '../services';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { Colors } from '../styles/Colors';

const PartnersDetails = ({ route, navigation, }) => {
    const { token } = useSelector(store => store.general.user)
    const { name } = useSelector(store => store.general.user)
    const { item: itempartner } = route.params;
    const [data, setData] = React.useState([])
    const [payResponse, setPayResponse] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [modalSuccess, setModalSuccess] = React.useState(false)

    // console.log('item', item.id)

    React.useEffect(() => {
        partnerDet()
    }, []);

    const partnerDet = () => {
        getPartensId(token, itempartner.id)
            .then((response) => {
                //console.log('response:::::', response.data)
                setData(response.data)
                setLoading(false)
            })
            .catch((err) => {
                console.log('listPeterr:::::', err)
                Alert.alert('Sucedio un error!', 'El servicio no esta disponible', [
                    { text: 'OK', onPress: () => setLoading(false) },
                ]);
            })
    }

    const pay = (item) => {
        setLoading(true)
        // console.log('partenr', itempartner.id)
        // console.log('servicio', item.id)
        const payload = {
            "service_id": item.id
        }

        payPartner(token, itempartner.id, payload)
            .then((response) => {
                //console.log('response:::::', response.data)
                setPayResponse(response.data)
                setLoading(false)
                setModalSuccess(true)
                // setData(response.data)
                // setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log('listPeterr:::::', err.response.status)
                if (err.response.status === 400) {
                    Alert.alert('Sucedio un error!', 'No tienes tarjeta agregada', [
                        { text: 'Tarjetas', onPress: () => navigation.navigate('BookmarkScreen') },
                    ]);
                } else {
                    Alert.alert('Sucedio un error!', 'El servicio no esta disponible', [
                        { text: 'OK', onPress: () => setLoading(false) },
                    ]);
                }
            })
    }

    const ModalSuccess = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                onRequestClose={() => { }}
                visible={modalSuccess}
                style={{ flex: 1 }} >
                <View style={{ width: width, height: height, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <View style={{ width: '90%', height: '40%', alignItems: 'center', backgroundColor: 'white', justifyContent: 'space-around', borderRadius: 20 }}>
                        <View style={{ height: '80%', width: '90%', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: '100%', height: '30%', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>!Felicidades¡</Text>
                                <Text style={{ color: 'black' }}>Compraste un servico</Text>
                            </View>
                            <View style={{ width: '100%', height: '70%', padding: 10, justifyContent: 'space-around', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#EF4136' }}>{payResponse?.name}</Text>
                                <Text style={{ fontWeight: '400', fontSize: 16, color: 'black' }}>{payResponse?.description}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>{`Total: ${payResponse?.amount}`}</Text>
                            </View>
                        </View>
                        <View style={{ height: '20%', width: '90%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <TouchableWithoutFeedback onPress={() => setModalSuccess(false)}>
                                <View elevation={5} style={{ height: 40, width: '90%', backgroundColor: '#EF4136', borderRadius: 10, justifyContent: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#CCC' }}>
                                    <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: '700', }}>Aceptar</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>

                </View>

            </Modal>
        )
    }

    const emptyList = () => {
        return (
            <View style={{ height: 200, width: '100%', justifyContent: 'center', alignItems: 'center', paddingLeft: 90 }}>
                <Text style={{ color: '#999', fontWeight: 'bold', fontSize: 18}}>{'No hay datos disponibles'}</Text>
            </View>
        )
    }

    const renderItem = (item) => {
        //console.log('pet', item.picture)
        return (
            <View elevation={5} style={{ height: 200, width: 200, backgroundColor: 'white' }}>
                <View style={{ height: '35%', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Avatar.Image
                        source={{
                            uri: item.picture
                        }}
                        size={50}
                        style={{ backgroundColor: 'lightgrey' }}
                    />
                </View>
                <View style={{ height: '30%', width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }}>
                    <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', textAlign: 'center' }}>{item?.name}</Text>
                    <Text style={{ fontSize: 14, color: 'black', fontWeight: '400', textAlign: 'center' }}>{item?.description}</Text>
                </View>
                <TouchableWithoutFeedback onPress={() => pay(item)}>
                    <View style={{ height: '35%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: '#FA6650', borderRadius: 5, width: '70%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{`$${item?.price}`}</Text>
                            <Image source={require('../assets/coin.png')} style={{ height: 30, width: 30 }} resizeMode={'contain'} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    return (
        <View style={{
            backgroundColor: '#F2F2F2', //#E6F8DB
            height: height / 1.1,
            width: width,
            alignItems: 'center'
        }}>
            {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
            {/* <Loader active={loading} /> */}
            <ModalSuccess />
            <View style={{ height: '28%', width: '100%' }}>
                <ImageBackground source={{ uri: data?.partner?.picture }} style={{ height: '100%', width: '100%' }} resizeMode={'contain'} />
            </View>
            <View style={{ height: '10%', width: '100%', paddingHorizontal: 20, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                <View>
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>{`${data?.partner?.name}`}</Text>
                    <Text style={{ fontSize: 14, color: '#EF4136', fontWeight: '400', textDecorationLine: 'underline' }}>{data?.partner?.phone}</Text>
                </View>
                <View>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('ScreenMaps', {item: data?.partner, address: data?.address})}>
                        <Image source={require('../assets/maps.png')} style={{ height: 40, width: 40 }} resizeMode='contain' />
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <View style={{ height: '32%', width: '100%' }}>
                <View style={{ width: '100%', height: '100%' }}>
                    <FlatList
                        // numColumns={3}
                        keyExtractor={(item, index) => `item-${index}`}
                        data={data.services}
                        horizontal
                        ItemSeparatorComponent={() => (
                            <View style={{ width: 10 }} />
                        )}
                        ListEmptyComponent={({ item }) => emptyList(item)}
                        //ListHeaderComponent={({ item }) => (<Text style={{ fontSize: 18, color: 'black', fontWeight: '500', textAlign:'center', marginBottom: 10 }}>Servicios</Text>)}
                        refreshControl={
                            <RefreshControl
                                //refresh control used for the Pull to Refresh
                                refreshing={loading}
                                onRefresh={partnerDet}
                            />
                        }
                        renderItem={({ item }) => renderItem(item)}
                    />
                </View>
            </View>
            <View elevation={5} style={{ backgroundColor: '#fff', height: '30%', width: '95%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 10, borderRadius: 20 }}>
                <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold', paddingTop: 10, marginBottom: 10, paddingLeft: 5 }}>MI INFORMACIÓN</Text>
                <View style={{ height: '35%', width: '100%', flexDirection: 'row' }}>
                    <View style={{ height: '100%', width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/icon1.png')} style={{ height: 15, width: 15 }} resizeMode={'contain'} />
                    </View>
                    <View style={{ height: '100%', width: '90%', justifyContent: 'center', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                        <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>{`Descripción: ${data?.partner?.description}`}</Text>
                    </View>
                </View>
                <View style={{ height: '20%', width: '100%', flexDirection: 'row' }}>
                    <View style={{ height: '100%', width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/Star.png')} style={{ height: 15, width: 15 }} resizeMode={'contain'} />
                    </View>
                    <View style={{ height: '100%', width: '90%', justifyContent: 'center', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                        <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>{`Email: ${data?.partner?.email}`}</Text>
                    </View>
                </View>
                <View style={{ height: '20%', width: '100%', flexDirection: 'row' }}>
                    <View style={{ height: '100%', width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/bag.png')} style={{ height: 15, width: 15 }} resizeMode={'contain'} />
                    </View>
                    <View style={{ height: '100%', width: '90%', justifyContent: 'center', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                        <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>{`RFC: ${data?.partner?.rfc}`}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PartnersDetails;

const { height, width } = Dimensions.get("window");
const height_logo = height * 0.18;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#694fad'
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    logo: {
        width: height_logo,
        height: height_logo,
        borderRadius: 150,
        backgroundColor: 'lightgrey'
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
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
});
