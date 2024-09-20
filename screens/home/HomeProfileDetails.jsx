import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Nutrition from './nutrition/Nutrition';
import {Colors} from '../../styles/Colors';
import Health from './health/Health';
import Activity from './activity/Activity';
import Welfare from './welfare/Welfare';
import Weight from './weight/Weight';
import WithoutPhoto from '../../components/WithoutPhoto';

const HomeProfileDetails = ({route, navigation}) => {
  const {item, tabIndex} = route.params;

  const renderScene = SceneMap({
    //first: Nutrition,
    first: ()=> <Health pet={item}/>,
    second: Welfare,
    //four: Activity,
    three: () => <Weight item={item} />,
  });

  console.log('ITEM: ', item);

  const [index, setIndex] = React.useState(tabIndex);
  const [routes] = React.useState([
    //{ key: "first", title: "NUTRICIÓN " },
    {key: 'first', title: 'SALUD'},
    {key: 'second', title: 'BIENESTAR'},
    //{ key: "four", title: "ACTIVIDAD" },
    {key: 'three', title: 'PESO'},
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: Colors.primaryColor}}
      style={{backgroundColor: Colors.white}}
      renderLabel={({route, focused}) => (
        <Text
          style={{
            color: focused && Colors.primaryColor,
            fontSize: 10,
            fontWeight: focused ? '700' : '600',
          }}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
     
        <View style={styles.imageContainer}>
          {item.picture ? (
            <Image source={{uri: item.picture}} style={styles.imageProfile} />
          ) : (
            <WithoutPhoto />
          )}
        </View>
        <View
          style={{
            height: "12%",
            justifyContent: 'center',
          }}>
          <Text style={styles.petName}>{item.name}</Text>
          <Text style={styles.info}>{`${item.age} años | ${
            item.gender === 'M' ? 'Macho' : 'Hembra'
          } | ${item.pet_breed.name}`}</Text>
        </View>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: '100%'}}
          renderTabBar={renderTabBar}
        />
      
    </SafeAreaView>
  );
};

export default HomeProfileDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 5,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logo: {
    borderRadius: 150,
    backgroundColor: 'lightgrey',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  imageProfile: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  imageContainer: {
    alignItems: 'center',
  },
  petName: {
    fontSize: 24,
    fontWeight: '800',
  },
  info: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
  },
});
