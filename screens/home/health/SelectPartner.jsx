import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import AppStorage from '../../../modules/AppStorage';
import ApiFetcher from '../../../modules/ApiFetcher';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native-animatable';
import {Colors} from '../../../styles/Colors';

const SelectPartner = ({route}) => {
  const {action} = route.params
  const [listPartners, setListPartners] = useState([]);
  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);


  const renderPartners = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('ListPartners', {
          partners: item.users,
          action: action
        })
      }>
      <View style={styles.leftSection}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.type_partner.name}</Text>
      </View>
      <View style={styles.RightSection}>
        <Image
          source={{uri: item.picture}}
          style={styles.imageItem}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );

  const fetchData = async () => {
    try {
      const partners = await apiFetcher.getPartners();
      if (partners.code == 200 || partners.code == 201)
        setListPartners(partners.data);
    } catch (error) {
      console.log('Error: ', error);
      Alert.alert('Ha ocurrido un error', 'Inténtelo de nuevo más tarde');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listPartners}
        renderItem={renderPartners}
        keyExtractor={item => item.id.toString()}
        style={styles.flatList}
      />
    </View>
  );
};

export default SelectPartner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  leftSection: {
    width: '50%',
  },
  imageItem: {
    height: 90,
    width: 90,
    borderRadius: 11,
  },
  RightSection: {
    paddingRight: 15,
  },
  itemDescription: {
    fontSize: 15,
    marginTop: 5,
    color: Colors.gray,
  },
  item: {
    height: 130,
    paddingLeft: 15,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    alignItems: 'center',
    shadowColor: Colors.gray,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 10,
    elevation: 5,
  },
});
