import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    StatusBar,
    Image,
    TextInput,
    TouchableWithoutFeedback,
    FlatList,
    useWindowDimensions,
    Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const ProfileDetails = ({ route, navigation }) => {
    const { token } = useSelector(store => store.general.user)
    const { name } = useSelector(store => store.general.user)
    const { item } = route.params;
    const [data, setData] = React.useState([50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80])


    const FirstRoute = () => (
        <View style={{ height: '100%', width: '100%', backgroundColor: '#fff' }} >
            <Image source={require('../assets/perfil1.png')} style={{ height: '100%', width: '100%' }} resizeMode={'contain'} />
        </View>
    );

    const SecondRoute = () => (
        <View style={{ height: '100%', width: '100%', backgroundColor: '#fff' }} >
            <Image source={require('../assets/perfil2.png')} style={{ height: '100%', width: '100%' }} resizeMode={'contain'} />
        </View>
    );

    const ThreeRoute = () => (
        <View style={{ height: '100%', width: '100%', backgroundColor: '#fff' }} >
            <Image source={require('../assets/perfil3.png')} style={{ height: '100%', width: '100%' }} resizeMode={'contain'} />
        </View>
    );

    const FourRoute = () => (
        <View style={{ height: '100%', width: '100%', backgroundColor: '#fff', alignItems: 'center' }} >
            <Image source={require('../assets/perfil5.png')} style={{ height: '80%', width: '100%' }} resizeMode={'contain'} />
            <TouchableWithoutFeedback onPress={null}>
                <View style={{ height: 50, width: '80%', backgroundColor: '#fff', borderRadius: 30, justifyContent: 'center', marginBottom: 20, borderColor: '#EF4136', borderWidth: 2 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, color: '#EF4136', fontWeight: '700' }}>Agendar cita spa</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );

    const FiveRoute = () => (
        <View style={{ height: '100%', width: '100%', backgroundColor: '#fff', alignItems: 'center' }} >
            <Image source={require('../assets/perfil4.png')} style={{ height: '80%', width: '100%' }} resizeMode={'contain'} />
            <TouchableWithoutFeedback onPress={null}>
                <View style={{ height: 50, width: '80%', backgroundColor: '#fff', borderRadius: 30, justifyContent: 'center', marginBottom: 20, borderColor: '#EF4136', borderWidth: 2 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, color: '#EF4136', fontWeight: '700' }}>Agendar cita vet</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        three: ThreeRoute,
        four: FourRoute,
        five: FiveRoute
    });

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'ACTIVIDAD ' },
        { key: 'second', title: 'ALIMENTACIÓN' },
        { key: 'three', title: 'PESO' },
        { key: 'four', title: 'SALUD' },
        { key: 'five', title: 'GROOMING' },
    ]);


    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#EF4136' }}
            style={{ backgroundColor: 'white' }}
            renderLabel={({ route, focused, color }) => (
                <Text style={{ color: focused ? '#EF4136' : 'black', fontSize: 10 }}>
                    {route.title}
                </Text>
            )}
        />
    );


    // console.log(':::oitem:::', item);

    return (
        <View style={{
            backgroundColor: '#F2F2F2', //#E6F8DB
            height: height / 1.1,
            width: width
        }}>
            <View style={{ height: '30%', width: '100%' }}>
                <Image source={require('../assets/dogProfile.png')} style={{ height: '100%', width: '100%' }} resizeMode={'cover'} />
            </View>
            <View style={{ height: '10%', width: '100%', paddingHorizontal: 20, justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ fontSize: 14, color: 'black', fontWeight: '300' }}>{`${item.age} años | ${item.gender === 'M' ? 'Macho' : 'Hembra'} | ${item.pet_breed.name}`}</Text>
            </View>
            <View style={{ height: '60%', width: '100%' }}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
                />
            </View>
        </View>
    );
};

export default ProfileDetails;

const { height, width } = Dimensions.get("window");
const height_logo = height * 0.18;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#694fad'
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
        paddingVertical: 30
    },
    logo: {
        width: height_logo,
        height: height_logo,
        borderRadius: 150,
        backgroundColor: 'lightgrey'
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
});
