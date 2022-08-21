import { NavigationContainer } from '@react-navigation/native'
import React, { useContext, useEffect } from 'react'
import { ColorPropType, StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useFonts } from 'expo-font'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import Cronometro from './src/screens/Cronometro'
import Placar from './src/screens/Placar'
import CronometroSensor from './src/screens/CronometroSensor'
import ButtonFunctionToggle from './src/global/components/ButtonFunctionToggle'
import Display from './src/global/components/Display'
import { SafeAreaView } from 'react-native-safe-area-context'
import Configuracao from './src/screens/Configuracao'
import { ConfigContext, ConfigProvider } from './src/contexts/config'
import { useState } from 'react'

export default function App() {
  const Tab = createBottomTabNavigator()
  //useFonts({ 'seven-segment': require('./src/assets/fonts/seven-segment.ttf') })

  let [fontsLoaded] = useFonts({
    'seven-segment': require('./src/assets/fonts/seven-segment.ttf'),
  })
  if (!fontsLoaded) {
    return <View />
  }

  return (
    <>
      <ConfigProvider>
        <SafeAreaView>
          <Display></Display>
        </SafeAreaView>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#2c8af2',
              headerShown: false,
            }}
          >
            <Tab.Screen
              name="Cronometro"
              component={Cronometro}
              options={{
                tabBarIcon: ({ focused }) => (
                  <Ionicons
                    name="timer-outline"
                    size={24}
                    color={focused ? '#2c8af2' : 'black'}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Sensores"
              component={CronometroSensor}
              options={{
                tabBarIcon: ({ focused }) => (
                  <MaterialCommunityIcons
                    name="run-fast"
                    size={24}
                    color={focused ? '#2c8af2' : 'black'}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Placar"
              component={Placar}
              options={{
                tabBarIcon: ({ focused }) => (
                  <MaterialCommunityIcons
                    name="scoreboard-outline"
                    size={24}
                    color={focused ? '#2c8af2' : 'black'}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Configuração"
              component={Configuracao}
              options={{
                tabBarIcon: ({ focused }) => (
                  <Ionicons
                    name="md-settings-outline"
                    size={24}
                    color={focused ? '#2c8af2' : 'black'}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ConfigProvider>
    </>
  )
}
