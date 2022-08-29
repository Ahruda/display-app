import { useState } from 'react'
import { useContext, useEffect } from 'react'
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
    <Toggle
      value={(estadoDisplay ? true : false) && props.funcao == funcao}
      onPress={buttonFunction}
      style={{}}
      //leftTitle="OFF"
      rightTitle="Ativo"
      trackBar={{
        activeBackgroundColor: '#9fcafa',
        inActiveBackgroundColor: '#dadada',
        borderActiveColor: '#2d76ff',
        borderInActiveColor: '#9e9e9e',
        borderWidth: 3,
        width: 100,
        height: 30,
        radius: 50,
      }}
      thumbButton={{
        activeBackgroundColor: '#d4e8ff',
        inActiveBackgroundColor: '#c2c2c2',

      }}
    />
  )
}
