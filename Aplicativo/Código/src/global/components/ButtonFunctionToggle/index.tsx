import { useState } from 'react'
import { useContext, useEffect } from 'react'
import { Text, View } from 'react-native'
import Toggle from 'react-native-toggle-element'
import { ConfigContext } from '../../../contexts/config'

interface ToggleProps {
  funcao: number
}

export default function ButtonFunctionToggle(props: ToggleProps) {
  const { funcao, setFuncao, estadoDisplay, setEstadoDisplay } =
    useContext(ConfigContext)

  const buttonFunction = () => {
    if (estadoDisplay) {
      if (props.funcao == funcao) {
        setEstadoDisplay(0)
      } else {
        setFuncao(props.funcao)
      }
    } else {
      setEstadoDisplay(1)
      if (props.funcao != funcao) {
        setFuncao(props.funcao)
      }
    }
  }

  return (
    <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
    <Text style={{marginRight:5}}>OFF</Text>
    <Toggle
      value={(estadoDisplay ? true : false) && props.funcao == funcao}
      onPress={buttonFunction}
      style={{}}
      trackBar={{
        activeBackgroundColor: '#a1eeb7',
        inActiveBackgroundColor: '#e6a1a1',
        borderActiveColor: '#0f9c37',
        borderInActiveColor: '#b92d2d',
        borderWidth: 3,
        width: 100,
        height: 30,
        radius: 50,
      }}
      thumbButton={{
        activeBackgroundColor: '#45bd67',
        inActiveBackgroundColor: '#d46666',
        

      }}
    />
    <Text style={{marginLeft:5}}>ON</Text>
    </View>
  )
}
