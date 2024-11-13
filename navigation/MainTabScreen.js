import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';
import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Share,
  Alert,
  Touchable,
} from 'react-native';

import HomeScreen from '../screens/home/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileDetails from '../screens/ProfileDetails';
import ProfileEdit from '../screens/ProfileEdit';
import EditPet from '../screens/EditPet';
import ProfileEditUser from '../screens/ProfileEditUser';
import ProfileEditPet from '../screens/ProfileEditPet';
import ProfileEditPetInfo from '../screens/ProfileEditPetInfo';
import ProfileEditPetInfo2 from '../screens/ProfileEditPetInfo2';
import HomeProfileDetails from '../screens/home/HomeProfileDetails';
import PartnersDetails from '../screens/PartnersDetails';
import ScreenMaps from '../screens/ScreenMaps';
import ViewWeb from '../screens/WebView';
import ChangePassword from '../screens/auth/ChangePassword';
import EditMyPet from '../screens/pet/EditMyPet';
import SearchItem from '../components/SearchItem';
import PartnersStack from './PartnersStack';
import SecondScreenRegisterPet from '../screens/pet/register/SecondScreenRegisterPet';
import ThirdScreenRegisterPet from '../screens/pet/register/ThirdScreenRegisterPet';
import FinalScreenRegisterPet from '../screens/pet/register/FinalScreenRegisterPet';
import IdMyPet from '../screens/pet/idPet/IdMyPet';
import IdInfoPet from '../screens/pet/idPet/IdInfoPet';
import MyCards from '../screens/cards/MyCards';
import AddNewCard from '../screens/cards/AddNewCard';
import Dates from '../screens/pet/dates/Dates';
import PetDate from '../screens/pet/dates/PetDate';
import History from '../screens/pet/history/History';
import RateService from '../screens/pet/history/RateService';
import ResumeDate from '../screens/pet/dates/ResumeDate';
import ChangeDate from '../screens/pet/dates/ChangeDate';
import {Colors} from '../styles/Colors';
import StepsRegister from '../screens/pet/register/StepsRegister';
import Success from '../components/Success';
import SelectPetVaccines from '../screens/vaccination-record/SelectPetVaccines';
import PetVaccinesRecord from '../screens/vaccination-record/PetVaccinesRecord';
import SelectPartner from '../screens/home/health/SelectPartner';
import ListPartners from '../screens/partners/ListPartners';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const HeartStack = createStackNavigator();
const HealthStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const shareInfo = async url => {
  try {
    const result = await Share.share({
      message: `Mira esta información acerca de nuestras mascotas: ${url}`,
      title: 'Tobi',
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert('Ocurrió un error', 'Inténtalo de nuevo más tarde');
  }
};
const activeColor = 'red';

const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({route}) => ({
      tabBarActiveTintColor: activeColor,
      tabBarInactiveTintColor: 'gray',
    })}>
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarColor: '#fff',
        tabBarIcon: ({color}) => (
          <Image
            source={require('../assets/home.png')}
            style={{height: 25, width: 25, tintColor: color, marginTop: 15}}
            resizeMode="contain"
          />
        ),
      }}
    />
    <Tab.Screen
      name="ProfileStack"
      component={ProfileStackScreen}
      options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarColor: '#fff',
        tabBarIcon: ({color}) => (
          <Image
            source={require('../assets/pet.png')}
            style={{height: 25, width: 25, tintColor: color, marginTop: 15}}
            resizeMode="contain"
          />
        ),
      }}
    />
    <Tab.Screen
      name="Notifications"
      component={DetailsStackScreen}
      options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarColor: '#fff',
        tabBarIcon: ({color}) => (
          <Image
            source={require('../assets/social.png')}
            style={{height: 25, width: 25, tintColor: color, marginTop: 15}}
            resizeMode="contain"
          />
        ),
      }}
    />
    <Tab.Screen
      name="Explore"
      component={PartnersStack}
      options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarColor: '#fff',
        tabBarIcon: ({color}) => (
          <Image
            source={require('../assets/shop.png')}
            style={{height: 25, width: 25, tintColor: color, marginTop: 15}}
            resizeMode="contain"
          />
        ),
      }}
    />
    {/* <Tab.Screen
      name="Heart"
      component={HeartStackScreen}
      options={{
        tabBarLabel: '',
        tabBarColor: '#fff',
        tabBarIcon: ({ color }) => (
          <Image source={require('../assets/heart.png')} style={{ height: 25, width: 25 }} resizeMode='contain' />
        ),
      }}
    /> */}
  </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false,
        //title:'Overview',
        // headerLeft: () => (
        //   <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
        //     <Image
        //       source={require("../assets/menu.png")}
        //       style={{ height: 25, width: 25, left: 10 }}
        //       resizeMode="contain"
        //     />
        //   </TouchableWithoutFeedback>
        // ),
      }}
    />
    <HomeStack.Screen
      name="HomeProfileDetails"
      component={HomeProfileDetails}
      options={{
        headerShown: true,
        headerBackTitleVisible: false,
        title: '',
        headerTintColor: 'black',
      }}
    />
    <HomeStack.Screen
      name="EditPet"
      component={EditPet}
      options={{
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Editar mascota',
        headerTintColor: 'black',
      }}
    />
    <HomeStack.Screen
      name="SelectPartner"
      component={SelectPartner}
      options={{
        headerLeft: null,
        title: 'Selecciona al Partner',
      }}
    />
    <HomeStack.Screen
      name="ListPartners"
      component={ListPartners}
      options={{
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Seleccionar al especialista',
        headerTintColor: 'black',
      }}
    />
  </HomeStack.Navigator>
);

const HealthStackScreens = ({navigation}) => (
  <HealthStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: '600',
      },
      headerTitleAlign: 'center',
    }}>
    <HealthStack.Screen
      name="SelectPartner"
      component={SelectPartner}
      options={{
        
        title: 'Selecciona al Partner',
      }}
    />
    <HealthStack.Screen
      name="ListPartners"
      component={ListPartners}
      options={{
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Seleccioanr especialista',
        headerTintColor: 'black',
      }}
    />
  </HealthStack.Navigator>
);

const DetailsStackScreen = ({navigation}) => (
  <DetailsStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: '600',
      },
      headerTitleAlign: 'center',
    }}>
    <DetailsStack.Screen
      name="Details"
      component={DetailsScreen}
      options={{
        headerLeft: null,
        title: 'Pet Parent University',
      }}
    />
    <DetailsStack.Screen
      name="WebView"
      component={ViewWeb}
      options={({route}) => ({
        title: 'Pet Parent University',
        headerLeft: null,
        headerRight: () => (
          <TouchableOpacity onPress={() => shareInfo(route.params.url)}>
            <Image
              source={require('../assets/share.png')}
              style={{height: 25, width: 25, marginRight: 15}}
            />
            {/* <MaterialCommunityIcons
              name="download"
              size={24}
              color="#F25455"
            /> */}
          </TouchableOpacity>
        ),
      })}
    />
  </DetailsStack.Navigator>
);

const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <ProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerShown: true,
        headerLeft: null,
        title: '',
        headerRight: ({route}) => (
          <TouchableOpacity
            // onPress={() => navigation.navigate("ProfileEditUser", {refreshData: route.params})}
            onPress={() => navigation.navigate('ProfileEditUser')}>
            <Image
              source={require('../assets/menu-icon.png')}
              style={{height: 30, width: 30, marginRight: 10}}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        ),
      }}
    />
    <ProfileStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={({navigation}) => ({
        headerShown: true,
        title: 'Cambiar contraseña',
        headerLeft: () => null,
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{fontSize: 25, marginRight: 15}}>x</Text>
            {/* <MaterialCommunityIcons
              name="exit"
              size={24}
              color="#F25455"
            /> */}
          </TouchableOpacity>
        ),
      })}
    />
    <ProfileStack.Screen
      name="MyCards"
      component={MyCards}
      options={({navigation}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Métodos de pago',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="AddNewCard"
      component={AddNewCard}
      options={({navigation}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Agregar nueva tarjeta',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="ProfileDetails"
      component={ProfileDetails}
      options={{
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#1f65ff"
            onPress={() => navigation.openDrawer()}></Icon.Button>
        ),
      }}
    />
    <ProfileStack.Screen name="ProfileEdit" component={ProfileEdit} />
    <ProfileStack.Screen name="ProfileEditUser" component={ProfileEditUser} />
    <ProfileStack.Screen
      name="EditPet"
      component={EditMyPet}
      options={{
        headerShown: false,
        // headerRight: () => (
        //   <TouchableOpacity
        //     style={{
        //       backgroundColor: "#EF4136",
        //       borderRadius: 32,
        //       justifyContent: "center",
        //       height: 50,
        //       width: 80,
        //       marginRight: 15,
        //       alignItems: "center",
        //     }}
        //     onPress={() => navigation.goBack()}
        //   >
        //     <Text style={{ fontSize: 16, color: "white", fontWeight: "700" }}>
        //       Listo
        //     </Text>
        //   </TouchableOpacity>
        // ),
      }}
    />
    <ProfileStack.Screen
      name="SearchItem"
      component={SearchItem}
      options={({route}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        headerTintColor: Colors.black,
        headerTitleStyle: {
          color: Colors.primaryColor,
          fontWeight: '700',
        },
        title:
          (route.params.type === 'foodType' && 'Buscar tipo de alimento') ||
          (route.params.type == 'foodBrand' && 'Buscar marca de alimento') ||
          (route.params.type == 'pets_breeds' && 'Buscar raza de mascota'),
      })}
    />
    <ProfileStack.Screen
      name="RegisterNewPet"
      component={StepsRegister}
      options={({route}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Registro nueva mascota',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="Success"
      component={Success}
      options={({route}) => ({
        headerShown: false,
      })}
    />
    <ProfileStack.Screen
      name="SecondScreenRegisterPet"
      component={SecondScreenRegisterPet}
      options={({route}) => ({
        headerShown: true,
        animationEnabled: false,
        headerBackTitleVisible: false,
        title: 'Registro nueva mascota',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="ThirdScreenRegisterPet"
      component={ThirdScreenRegisterPet}
      options={({route}) => ({
        headerShown: true,
        animationEnabled: false,
        headerBackTitleVisible: false,
        title: 'Registro nueva mascota',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="FinalScreenRegisterPet"
      component={FinalScreenRegisterPet}
      options={({route}) => ({
        headerShown: true,
        animationEnabled: false,
        headerBackTitleVisible: false,
        title: 'Registro nueva mascota',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="IdMyPet"
      component={IdMyPet}
      options={({route}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Id. digital de mi mascota',
        headerTintColor: 'black',
      })}
    />

    <ProfileStack.Screen
      name="IdInfoPet"
      component={IdInfoPet}
      options={({route}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Id. digital de mi mascota',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="Appointments"
      component={Dates}
      options={({route}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Tus próximas citas',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="SelectPetVaccines"
      component={SelectPetVaccines}
      options={({route}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Cartillas',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="PetVaccinesRecord"
      component={PetVaccinesRecord}
      options={({route}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Cartilla',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="PetAppointment"
      component={PetDate}
      options={({route}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Tus próximas citas',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="ResumeAppointment"
      component={ResumeDate}
      options={({route}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Resumen de cita',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="ChangeDate"
      component={ChangeDate}
      options={({route}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Editar de cita',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="History"
      component={History}
      options={({route}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Historial',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen
      name="RateService"
      component={RateService}
      options={({route}) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Historial',
        headerTintColor: 'black',
      })}
    />
    <ProfileStack.Screen name="ProfileEditPet" component={ProfileEditPet} />
    <ProfileStack.Screen
      name="ProfileEditPetInfo"
      component={ProfileEditPetInfo}
    />
    <ProfileStack.Screen
      name="ProfileEditPetInfo2"
      component={ProfileEditPetInfo2}
    />
    <ProfileStack.Screen name="ScreenMaps" component={ScreenMaps} />
    {/* <ProfileStack.Screen name="RootStack" component={RootStackScreen} /> */}
  </ProfileStack.Navigator>
);

const ExploreStackScreen = ({navigation}) => (
  <HeartStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <HeartStack.Screen name="ExploreScreen" component={ExploreScreen} />
    <HeartStack.Screen name="PartnersDetails" component={PartnersDetails} />
    <HeartStack.Screen name="ScreenMaps" component={ScreenMaps} />
  </HeartStack.Navigator>
);
