import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Cronometro from './src/screens/Cronometro'
import Placar from './src/screens/Placar'

export default function App() {
  const Tab = createBottomTabNavigator()

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Cronometro" component={Cronometro} />
        <Tab.Screen name="Placar" component={Placar} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
