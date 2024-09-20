import React from 'react';
import { View, Text, Button, StyleSheet, TextInput, FlatList, Dimensions, TouchableWithoutFeedback, Image, RefreshControl, Platform, ScrollView } from 'react-native';
import { listPet } from '../services';
import { useDispatch, useSelector } from 'react-redux';
import { generalDataAction } from '../redux/generalDuck';
import { Avatar } from 'react-native-paper';


const { width, height } = Dimensions.get('window');

const MessageTicket = ({ route, navigation }) => {


    const { message } = route?.params;


    console.log('erick::::::', message)
    return (
        <View style={styles.container}>
            <View style={{ width: width / 1.1, height: '20%', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 20 }}>
                <Text style={{ fontSize: 20, color: '#000', fontWeight: 'bold', paddingBottom: 20 }}>Message Ticket</Text>
                <View style={{ width: '100%', height: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#D4D4D4' }}>
                    <Image source={require('../assets/lupa.png')} style={{ height: 15, width: 15 }} resizeMode={'contain'} />
                    <TextInput
                        placeholder="Buscar contenidos"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => null}
                    />
                    <Image source={require('../assets/micro.png')} style={{ height: 15, width: 15 }} resizeMode={'contain'} />
                </View>
            </View>
            <View style={{ width: width / 1.1, height: '80%' }}>
                <View style={{ width: width / 1.1, alignItems: 'center' }}>
                    <View elevation={5} style={{ width: '90%', height: '90%', backgroundColor: '#F2F2F2', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <ScrollView>
                            <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>{message}</Text>
                        </ScrollView>

                    </View>
                </View>
            </View>
        </View>
    );
};

export default MessageTicket;

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    text: {
        fontSize: 11
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
    },
    elevation: {
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    }
});





{/* <FlatList
          // numColumns={3}
          keyExtractor={(item, index) => `item-${index}`}
          data={data}
          ItemSeparatorComponent={() => (
            <View style={{ height: 10 }} />
          )}
          refreshControl={<RefreshControl
            //refreshing={this.state.isFetching}
            onRefresh={() => fetchDta()}
            tintColor="#55D0DC"
            title="Loading..."
            titleColor="black"
            colors={['black', 'black', 'black']}
            progressBackgroundColor="white"
          />
          }
          renderItem={({ item }) => renderItem(item)}
        /> */}