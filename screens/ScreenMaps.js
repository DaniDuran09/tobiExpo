import React from 'react';
import { View, Text, Linking, StyleSheet, Platform, PermissionsAndroid, Dimensions, TouchableWithoutFeedback, Image, Modal } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewComponent from './partners/MapViewComponent';

const { width, height } = Dimensions.get('window');

const ScreenMaps = ({ route, navigation }) => {

    const { item, address } = route.params;
    const [loading, setLoading] = React.useState(false)
    const [modal, setModal] = React.useState(false)

    React.useEffect(() => {
    }, []);

    const linkMaps = () => {
        setModal(false)
        const scheme = Platform.OS === 'ios' ? 'mapas:0,0?q=' : 'geo:0,0?q=';
        const latLng = `${parseFloat(item?.latitude)},${parseFloat(item?.longitude)}`;
        const label = 'Custom Label';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        Linking.openURL(url);
    }

    const ModalPackage = () => {

        return (
            <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
                visible={modal}
                style={{ flex: 1 }} >
                <View style={{ height: height, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ height: '23%', width: '85%', backgroundColor: '#EEEEEE', borderRadius: 15, justifyContent: 'space-around', paddingHorizontal: 15, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#000', }}>{'Seleccionar navegador'}</Text>
                        <Text style={{ fontSize: 13, color: '#000', textAlign: 'center', }}>{'Selecciona el navegador con el que quieres realizar la navegación de tu ruta.'}</Text>
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableWithoutFeedback onPress={() => linkMaps()}>
                                <View elevation={5} style={{ height: 35, width: '60%', backgroundColor: '#F03D2D', borderRadius: 10, justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontSize: 16, color: '#FFFFFF', fontWeight: '700', }}>Google Maps</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <View style={styles.container}>
            <ModalPackage />
            <View style={{ width: width / 1.1, height: '95%', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ width: '100%', height: '10%', justifyContent: 'center', backgroundColor:'white' }}>
                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/rigth.png')} style={{ height: 25, width: 25, position: 'absolute', zIndex: 1 }} resizeMode='contain' />
                    </TouchableWithoutFeedback>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', zIndex: 0 }}>
                        <Text style={{ color: 'black', fontWeight: '400', fontSize: 18}}>{`Dirección`}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ alignItems: 'flex-end', width: '25%' }}>
                        <Image source={require('../assets/point.png')} style={{ height: 20, width: 20 }} resizeMode='contain' />
                    </View>
                    <View style={{ alignItems: 'flex-start', width: '75%', paddingLeft: 10 }}>
                        <Text style={{ color: 'black' }}>{`${address?.street}, #${address?.number}, ${address?.city}, ${address?.state}, ${address?.postal_code}`}</Text>
                    </View>
                </View>
                <MapViewComponent
                    latitude={item?.latitude}
                    longitude={item?.longitude}
                    title={item?.name}
                    description={item?.description}
                />
                <View style={{ height: '10%', width: '90%', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'row' }}>
                    <TouchableWithoutFeedback onPress={() => setModal(true)}>
                        <View style={{ height: 40, width: '100%', backgroundColor: '#EF4136', borderRadius: 5, justifyContent: 'center', marginBottom: 15 }}>
                            <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: '700', }}>{'Continuar'}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </View>
    );
};

export default ScreenMaps;

const styles = StyleSheet.create({
    container: {
        height: height / 1,
        width: width,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#F2F2F2'
    },
    text: {
        fontSize: 11
    },
    textInput: {
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
});
