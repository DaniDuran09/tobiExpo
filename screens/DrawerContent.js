import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDispatch, useSelector } from 'react-redux';
import { generalDataAction } from '../redux/generalDuck';

export function DrawerContent(props) {

    const dispatch = useDispatch();
    const { name, email, picture } = useSelector(store => store?.general?.user)

    const signOut = () => {
        const foundUser = {}
        dispatch(generalDataAction(foundUser))
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#E6F8DB' }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Avatar.Image
                                source={{
                                    uri: picture
                                }}
                                size={50}
                                style={{ backgroundColor: 'lightgrey' }}
                            />
                            <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                                <Title style={styles.title}>{name}</Title>
                                <Caption style={styles.caption}>{email}</Caption>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                <Caption style={styles.caption}>Following</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                                <Caption style={styles.caption}>Followers</Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image source={require('../assets/home.png')} style={{ height: 25, width: 25 }} resizeMode='contain' />
                            )}
                            label="Home"
                            onPress={() => { props.navigation.navigate('Home') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image source={require('../assets/pet.png')} style={{ height: 25, width: 25 }} resizeMode='contain' />
                            )}
                            label="Profile"
                            onPress={() => { props.navigation.navigate('Profile') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image source={require('../assets/social.png')} style={{ height: 25, width: 25 }} resizeMode='contain' />
                            )}
                            label="Pet parent university"
                            onPress={() => { props.navigation.navigate('Notifications') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image source={require('../assets/shop.png')} style={{ height: 25, width: 25 }} resizeMode='contain' />
                            )}
                            label="Partners"
                            onPress={() => { props.navigation.navigate('Explore') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image source={require('../assets/cards.png')} style={{ height: 25, width: 25 }} resizeMode='contain' />
                            )}
                            label="Card"
                            onPress={() => { props.navigation.navigate('BookmarkScreen') }}
                        />
                        {/* <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="account-check-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Support"
                            onPress={() => { props.navigation.navigate('SupportScreen') }}
                        /> */}
                    </Drawer.Section>
                    {/* <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={theme}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark} />
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section> */}
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    label="Sign Out"
                    onPress={signOut}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});
