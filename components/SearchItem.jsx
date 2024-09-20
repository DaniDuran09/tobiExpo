import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../styles/Colors';
import {foodBrandsService, foodTypes, petBrands} from '../services';
import ApiFetcher from '../modules/ApiFetcher';

const SearchItem = ({route}) => {
  const {type, setValue, id, screen} = route.params;

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const apiFetcher = new ApiFetcher();


  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, items]);

  const getItems = async () => {
    setLoading(true);
    try {
      let response;
      if (type === 'foodBrand') {
        response = await foodBrandsService();
      } else if (type == 'foodType') {
        response = await foodTypes(1);
      } else if (type == 'pets_breeds' && id) {
        console.log('El id: ', id);
        response = await apiFetcher.getPetBrands(id);
      }
      setItems(response.data);
    } catch (error) {
      console.log(`Error ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    const filtered = items.filter(item => {
      if (type === 'pets_breeds') {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return item.label.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
    setFilteredItems(filtered);
  };

  const renderItem = ({item}) =>
    type == 'pets_breeds' ? (
      <TouchableOpacity style={styles.item} onPress={() => setValue(item)}>
        {item.name !== 'Seleccione marca de comida' &&
        item.name !== 'Seleccione tipo de comida' ? (
          <Text>{item.name}</Text>
        ) : null}
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={styles.item} onPress={() => setValue(item)}>
        {item.label !== 'Seleccione marca de comida' &&
        item.label !== 'Seleccione tipo de comida' ? (
          <Text>{item.label}</Text>
        ) : null}
      </TouchableOpacity>
    );

  return (
    <View style={styles.container}>
      <View style={styles.barSearchContainer}>
        <Image
          source={require('../assets/search.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <TextInput
          placeholder="Buscar"
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          style={styles.searchInput}
        />
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primaryColor}
          style={{marginTop: '50%'}}
        />
      ) : (
        <>
          {filteredItems.length > 0 ? (
            <View style={[styles.brandContainer, screen == 1 ? {backgroundColor: Colors.secondaryColor} : {backgroundColor: Colors.lightBlue}]}>
              <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.flatList}
              />
            </View>
          ) : (
            <Text style={styles.noResultsText}>
              No hay resultados similares
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default SearchItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  barSearchContainer: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 32,
    padding: 15,
    backgroundColor: Colors.lightGray,
  },
  searchInput: {},
  image: {
    width: 20,
    height: 20,
    backgroundColor: Colors.lightGray,
  },
  item: {
    padding: 20,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.gray,
  },
  brandContainer: {
    marginTop: '2%',
    marginBottom: "10%",
    borderRadius: 12,
  },
});
