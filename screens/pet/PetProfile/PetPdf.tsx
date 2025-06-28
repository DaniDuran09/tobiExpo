import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Dimensions , Image, Linking } from 'react-native';
import { Avatar } from 'react-native-paper';
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';
import {  AnimatedImage, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function PetPdf() {
    
        const route = useRoute();
        const {pet} = route.params;
        console.log(pet)
        const navigation = useNavigation();
        const source = { uri: 'https://files-stg.s3.amazonaws.com/clients/532/pets/664/certificatepet/1749165877-tobi_Cartilla.pdf', cache: true };
        const openPDF = () => {
            console.log('hola')
            const url = 'https://files-stg.s3.amazonaws.com/clients/532/pets/664/certificatepet/1749165877-tobi_Cartilla.pdf '
            Linking.openURL(url);
            
        }
        
        return (
            <SafeAreaView style={styles.container}>
                <View width={'100%'} height={50} row paddingR-10 centerV>
                    <TouchableOpacity br100 style={{width:100,height:50}} row centerV onPress={()=>navigation.goBack()}>
                        <Icon name="chevron-left" size={45} color="black" />
                        <AnimatedImage  source={{ uri: pet.picture }} style={{width:40,height:40,borderRadius:100}}/>
                    </TouchableOpacity>
                    <View flex/>
                    <TouchableOpacity style={{width:50,height:50}} center onPress={openPDF}>
                        <Image
                            source={require("./../../../assets/share.png")}
                            style={{ height: 25, width: 25 }}
                        />
                        </TouchableOpacity>
                </View>
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
            </SafeAreaView>
        )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor:'white',
        paddingTop:20,
    },
    pdf: {
        width:'100%',
        height:'75%',
    }
});