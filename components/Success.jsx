import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {Colors} from '../styles/Colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AnimatedLottieView from 'lottie-react-native';

const Success = ({route}) => {
  const {text, action} = route.params;
  useEffect(() => {
    setTimeout(() => {
      action();
    }, 2500);
  }, []);
  return (
    <View style={styles.container}>
        <AnimatedLottieView source={require('../assets/animations/check.json')} autoPlay loop={false} style={styles.animation}/>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  animation: {
    width: 150,
    height: 150,
  },
  text: {
    fontSize: 20,
    marginTop: "4%",
    color: Colors.green,
    fontWeight: "600"
  },
});
