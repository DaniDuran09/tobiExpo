import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Image, Linking } from 'react-native';
import { Avatar } from 'react-native-paper';
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedImage, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import ApiFetcher from "../../../modules/ApiFetcher";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getCards } from '../../../services';


export default function PetPdf() {

  const apiFetcher = new ApiFetcher();

    const [certificates,setCertificates] = useState([]);
    const route = useRoute();
    const { pet } = route.params;
    console.log(pet)
    const navigation = useNavigation();
    const source = { uri: certificates.certificate_pet, cache: true };
    const openPDF = () => {
        console.log('hola')
        const url = 'https://files-stg.s3.amazonaws.com/clients/532/pets/664/certificatepet/1749165877-tobi_Cartilla.pdf '
        Linking.openURL(url);
    }
    useEffect(()=>{
        getCertificates();
    },[])

    const openImage = (url:any) => {
        const urlImage = url

            console.log(certificates)
        if(urlImage !== null){
            Linking.openURL(urlImage)
        }
    }

    const getCertificates = async () => {
        try {
        const res = await apiFetcher.getCertificates(pet.id);
        setCertificates(res.data)
        } catch (error) {
            console.log("error",error);
        }
    }
    

    return (
        <SafeAreaView style={styles.container}>
            <View width={'100%'} height={50} row paddingR-10 centerV>
                <TouchableOpacity br100 style={{ width: 100, height: 50 }} row centerV onPress={() => navigation.goBack()}>
                    <Icon name="chevron-left" size={45} color="black" />
                    <AnimatedImage source={{ uri: pet.picture }} style={{ width: 40, height: 40, borderRadius: 100 }} />
                </TouchableOpacity>
                <View flex />
                <TouchableOpacity style={{ width: 50, height: 50 }} center onPress={()=>openImage(certificates.certificate_pet)}>
                    <Image
                        source={require("./../../../assets/share.png")}
                        style={{ height: 25, width: 25 }}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.pdfContainer}>
                <Pdf
                    trustAllCerts={false}
                    source={source}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}
                />
            </View>
            <View paddingH-10 paddingV-10>
                <TouchableOpacity row centerV onPress={()=>openImage(certificates.certificate_deworming)}>
                    <Image
                        source={require("./../../../assets/jpgLogo.png")}
                        style={{ height: 25, width: 25 }}
                    />
                    <Text grey40 >desp.jpg</Text>
                </TouchableOpacity>
                <TouchableOpacity row centerV marginT-5 onPress={()=>openImage(certificates.certificate_vaccine)}>
                    <Image
                        source={require("./../../../assets/jpgLogo.png")}
                        style={{ height: 25, width: 25 }}
                    />
                    <Text grey40 >vacunas.jpg</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 20,
    },
    pdfContainer: {
        width: '100%',
        height:'80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pdf: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
    },
});