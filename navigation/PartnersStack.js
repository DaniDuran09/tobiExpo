import { createStackNavigator } from '@react-navigation/stack';
import SelectService from '../screens/partners/SelectService';
import PartnersGeneralInfo from '../screens/partners/PartnersGeneralInfo';
import PartnersMain from '../screens/partners/PartnersMain';
import InfoServiceForDate from '../screens/partners/date/InfoServiceForDate';
import Resume from '../screens/partners/date/Resume';
import AddNewCard from '../screens/cards/AddNewCard';
import ListPartners from '../screens/partners/ListPartners';
import InfoServiceByPartner from '../screens/partners/InfoServiceByPartner';
import ResumeDateByPartner from '../screens/partners/ResumeDateByPartner';
import NewService1 from '../screens/newService/NewService1';
import Success from '../components/Success';
import PaymentScreen from '../screens/cards/PaymentScreen';

const Stack = createStackNavigator();

const PartnersStack = () => {
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerTitleAlign: 'center',
      }}
      initialRouteName="PartnersMain">
      <Stack.Screen
        name="PartnersMain"
        component={PartnersMain}
        options={{
          gestureEnabled: false,
          headerLeft: null,
          title: 'Servicios',
        }}
      />
      <Stack.Screen
        name="NewService"
        component={NewService1}
        options={{
          title: "Busqueda de servicio",
        }}
      />
      <Stack.Screen
        name="SelectService"
        component={SelectService}
        options={{
          headerLeft: null,
          title: 'Servicios',
        }}
      />
      <Stack.Screen
        name="PartnersGeneralInfo"
        component={PartnersGeneralInfo}
        options={{
          headerShown: true,
          title: 'Reserva de cita'
        }}
      />
      <Stack.Screen
        name="InfoServiceForDate"
        component={InfoServiceForDate}
        options={{
          headerLeft: null,
          title: 'Agendar cita',
        }}
      />
      <Stack.Screen
        name="InfoServiceByPartner"
        component={InfoServiceByPartner}
        options={{
          headerLeft: null,
          title: 'Agendar cita',
        }}
      />
      <Stack.Screen
        name="Success"
        component={Success}
        options={({ route }) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Resume"
        component={Resume}
        options={{
          headerLeft: null,
          title: 'Agendar cita',
        }}
      />
      <Stack.Screen
        name="ResumeDateByPartner"
        component={ResumeDateByPartner}
        options={{
          headerLeft: null,
          title: 'Agendar cita',
        }}
      />
      <Stack.Screen
        name="ListPartners"
        component={ListPartners}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Agendar cita',
          headerTintColor: 'black',
        }}
      />
      <Stack.Screen
        name="AddNewCard"
        component={AddNewCard}
        options={({ navigation }) => ({
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Agregar nueva tarjeta',
          headerTintColor: 'black',
        })}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={({
          headerShown: false,
          headerBackTitleVisible: false,
          title:'Confirmación de cita'
        })}
      />
    </Stack.Navigator>
  );
};

export default PartnersStack;
