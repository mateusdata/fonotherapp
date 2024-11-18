import React from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { StatusBar } from 'expo-status-bar';
import { colorPrimary } from '../../../style/ColorPalette';
import { View } from 'react-native-animatable';
import { Image, Text } from 'react-native';
import Home from '../../../screens/doctorServices/Home';
import Videos from '../../../screens/doctorServices/Videos';
import MyAccount from '../../../screens/account/MyAccount';
import ButtonHelp from '../../../components/ButtonHelp';

const Tab = createBottomTabNavigator();


export default function MyComponent() {
  const navigation = useNavigation<any>();
  return (

    <Tab.Navigator
      id={undefined}
      screenOptions={{
        animation: 'fade',
        headerShown: false,
        headerStyle: {
          backgroundColor: colorPrimary
        },
        headerRight: () => (
          <ButtonHelp onPress={() => { navigation.navigate("FrequentlyAskedQuestions") }} />
        )
      }}

      tabBar={({ navigation, state, descriptors, insets }: any) => (
        <>
          <BottomNavigation.Bar
            activeColor='#36B3B9'
            compact
            style={{ backgroundColor: "white", borderTopWidth: 1, borderTopColor: "#ECF2FF" }}
            navigationState={state}
            safeAreaInsets={insets}
            onTabPress={({ route, preventDefault }: any) => {
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
            renderTouchable={({ key, ...props }) => <TouchableRipple key={key} {...props} />}
            renderIcon={({ route, focused, color }: any) => {
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
        </>
      )}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          freezeOnBlur: true,
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size, focused }) => {
            return <Icon testID='home' name="home" size={size} color={!focused ? colorPrimary : "#2A9095"} />;
          },
          tabBarActiveTintColor: "white",
          tabBarActiveBackgroundColor: "white",
          headerShown: true,
          headerTitleAlign: "left",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "row", gap: 1 }}>
                <Text style={{ color: "white", fontSize: 20, fontWeight: 600 }}>Fonother</Text>
                <Text style={{ color: "white", fontSize: 20, fontWeight: 600 }}>App</Text>
              </View>
              <Image resizeMode='contain' style={{ width: 40, height: 40, right: 8, bottom: 1 }} source={require("../../../assets/images/logo.png")} />
            </View>
          ),
          headerTintColor: "white",
        }}
      />
      <Tab.Screen
        name="Videos"
        component={Videos}
        options={{
          tabBarLabel: 'Exercícios',
          tabBarIcon: ({ color, size, focused }) => {
            return <Icon testID='videos' name="video" size={size} color={!focused ? colorPrimary : "#2A9095"} />;
          },
          headerShown: true,
          headerTitleAlign: "left",
          headerTintColor: "white",
        }}
      />

      <Tab.Screen
        name="MyAccount"
        component={MyAccount}
        options={{
          tabBarLabel: 'Conta',
          tabBarIcon: ({ color, size, focused }) => {
            return <Icon testID='conta' name="account" size={size} color={!focused ? colorPrimary : "#2A9095"} />;
          },
          headerShown: true,
          headerTitleAlign: "left",
          headerTitle: "Meu perfil",
          headerTintColor: "white"
        }}
      />
    </Tab.Navigator>

  );
}
