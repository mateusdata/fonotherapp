import React from 'react';
import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../../../pages/home';
import Videos from '../../../pages/Videos';
import MyAccount from '../../../pages/MyAccount';
import { StatusBar } from 'expo-status-bar';
import { colorPrimary } from '../../../style/ColorPalette';
import { View } from 'react-native-animatable';
import { Image, Text } from 'react-native';

const Tab = createBottomTabNavigator();
const arrayEmojis = ["🫂", "🫂", "😊", "🥰", "🗣️",];


export default function MyComponent() {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: colorPrimary
          }
        }}
        tabBar={({ navigation, state, descriptors, insets }) => (
          <BottomNavigation.Bar
            activeColor='#36B3B9'
            compact
            style={{ backgroundColor: "white", borderTopWidth: 1, borderTopColor: "#ECF2FF" }}
            navigationState={state}
            safeAreaInsets={insets}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({ route, focused, color }) => {
              const { options } = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({ focused, color, size: 24 });
              }

              return null;
            }}
            getLabelText={({ route }: any) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                    ? options.title
                    : route.name;

              return label;
            }}

          />
        )}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Início',
            tabBarIcon: ({ color, size }) => {
              return <Icon name="home" size={size} color={color} />;
            },
            tabBarActiveTintColor: "white",
            tabBarActiveBackgroundColor: "white",
            headerShown: true,
            headerTitleAlign: "left",
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ flexDirection: "row", gap: 1 }}>
                  <Text style={{ color: "white", fontSize: 20, fontWeight: 600 }}>Fonother</Text>
                  <Text style={{ color: "white", fontSize: 20, fontWeight: 600 }}>app</Text>
                </View>
                <Image resizeMode='contain' style={{ width: 40, height: 40, right: 8, bottom: 1 }} source={require("../../../assets/images/logo.png")} />
              </View>
            ),
            headerTintColor: "white"
          }}
        />
        <Tab.Screen
          name="Videos"
          component={Videos}
          options={{
            tabBarLabel: 'Exercícios',
            tabBarIcon: ({ color, size }) => {
              return <Icon name="video" size={size} color={color} />;
            },
            headerShown: true,
            headerTitleAlign: "left",
            headerTintColor: "white"
          }}
        />

        <Tab.Screen
          name="MyAccount"
          component={MyAccount}
          options={{
            tabBarLabel: 'Conta',
            tabBarIcon: ({ color, size }) => {
              return <Icon name="account" size={size} color={color} />;
            },
            headerShown: true,
            headerTitleAlign: "left",
            headerTitle: ""
          }}
        />
      </Tab.Navigator>
    </>
  );
}
