// ServiceList.tsx
import React from 'react';
import { 
  Image, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';
import { ServiceListProps } from './types';

const ServiceList = (props: ServiceListProps) => {
  return (
    <View style={styles.containerImage}>
      <TouchableOpacity onPress={props.onPress}>
        <Image source={props.imageSource} style={styles.image} resizeMode="contain" />
        <View style={styles.cover}>
          <Text style={styles.mainText}>{props.title}</Text>
          {props.subtitle && (
            <View style={styles.limit}>
              <Text style={styles.secondaryText}>{props.subtitle}</Text>
            </View>
          )}
          <View style={styles.viewMore}>
            <Text style={styles.textViewMore}>Ver más</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerImage: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 375,
    height: 250,  
  },
  limit: {
    width: 100,
  },
  cover: {
    position: 'absolute',
    left: 40,
    top: 80,
  },
  mainText: {
    fontSize: 24,
    fontWeight: '900',
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 10,
  },
  viewMore: {
    marginTop: 10,
    padding: 5,
    width: 80,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FA6650',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textViewMore: {
    color: '#FFFFFF',
  },
});

export default ServiceList;
