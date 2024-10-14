import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, gradientColors } from '../styles/Colors'

const VaccineCard = (props) => {
    const {info} = props;
  return (
    <View style={styles.mainContainer}>
    <View style={styles.sectionContainer}>
      <LinearGradient
        colors={gradientColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.vaccineNameContainer}>
        <Text style={styles.vaccineName}>{info.item.name}</Text>
      </LinearGradient>
      <View style={styles.infoContainer}>
        <Text style={styles.date}>Fecha de aplicación</Text>
        <Text style={styles.dateText}>__________</Text>
      </View>
    </View>
    <View style={styles.sectionContainer}>
      <View
        style={[
          styles.vaccineNameContainer,
          {backgroundColor: Colors.white},
        ]}>
        <Text style={styles.dewormerName}>
          Marca:{''} <Text style={{color: Colors.black}}>________</Text>
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.date}>Vencimiento</Text>
        <Text style={styles.dateText}>__________</Text>
      </View>
    </View>
    <View style={styles.iconContainer}>
      <Image
        source={require('../assets/images/warning-icon.png')}
        resizeMode="contain"
      />
    </View>
  </View>
  )
}

export default VaccineCard

const styles = StyleSheet.create({
      mainContainer: {
        backgroundColor: Colors.mediumWhite,
        margin: '4%',
        paddingBottom: 10,
        borderRadius: 8,
        flexDirection: 'row',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
          height: 2,
          width: 1,
        },
      },
      vaccineNameContainer: {
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      },
      vaccineName: {
        fontWeight: '700',
        color: Colors.white,
      },
      dewormerName: {
        fontWeight: '600',
        color: Colors.gray,
      },
      sectionContainer: {
        width: '50%',
      },
      infoContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: '5%',
      },
      date: {
        fontWeight: '600',
        color: Colors.gray,
        marginBottom: "2%"
      },
      dateText: {
        fontWeight: '500',
        color: Colors.black,
      },
      iconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
      },
})