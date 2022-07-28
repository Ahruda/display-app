import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useFonts } from 'expo-font'

import Cronometro from './src/screens/Cronometro'
import Placar from './src/screens/Placar'
import CronometroSensor from './src/screens/CronometroSensor'
import ButtonFunctionToggle from './src/global/components/ButtonFunctionToggle'

export default function App() {
  const Tab = createBottomTabNavigator()
  useFonts({ 'seven-segment': require('./src/assets/fonts/seven-segment.ttf') })

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Cronometro" component={Cronometro} />
        <Tab.Screen
          name="Cronometro com Sensores"
          component={CronometroSensor}
        />
        <Tab.Screen name="Placar" component={Placar} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
