import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { Text, View } from 'react-native-ui-lib';

export default function PetPdf() {
    
        const source = { uri: 'https://files-stg.s3.amazonaws.com/clients/532/pets/664/certificatepet/1749165877-tobi_Cartilla.pdf', cache: true };
        return (
            <View flex paddingT-50>
                <View width={'100%'} height={50}>
                    <View br100 bg-red10 width={50} height={50} />
                </View>
                <Pdf
                trustAllCerts={false}
                    source={source}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}
                    />
            </View>
        )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop:50,
        backgroundColor:'blue'
    },
    pdf: {
        width:'100%',
        height:'70%',
    }
});
/* return (
            <View style={styles.container}>
              <Text white text30>HOLA</Text>
                <Pdf
                trustAllCerts={false}
                    source={source}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}
                    />
            </View>
        )*/