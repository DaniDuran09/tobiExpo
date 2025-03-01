import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BlogItem } from '../../screens/DetailsScreen/types'

interface RenderItemProps {
  item: BlogItem;
  navigation: any; 
}

const RenderItem = ({ item, navigation }: RenderItemProps) => (
  <TouchableOpacity onPress={() => navigation.navigate('WebView', { url: item.url })}>
    <View style={[styles.elevation, { width: '100%', alignItems: 'center' }]}>
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={{ uri: item.picture }} style={{ height: 60, width: 60, borderRadius: 100 }} resizeMode="cover" />
        </View>
        <View style={{ width: '95%', marginVertical: 20 }}>
          <View style={{ width: '80%', paddingTop: 10, marginLeft: 15 }}>
            <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold', paddingBottom: 5 }}>{item.name}</Text>
            <Text style={{ fontSize: 12, color: '#000' }}>{item.description}</Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  elevation: {
    backgroundColor: '#fff',
    shadowColor: '#000000',
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default RenderItem;
