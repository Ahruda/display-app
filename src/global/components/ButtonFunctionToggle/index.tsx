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
    console.log('hey!!!')
    if (estadoDisplay) {
      if (props.funcao == funcao) {
        setEstadoDisplay(false)
      } else {
        setFuncao(props.funcao)
      }
    } else {
      setEstadoDisplay(true)
      if (props.funcao != funcao) {
        setFuncao(props.funcao)
      }
    }
  }

  return (
    <Toggle
      value={estadoDisplay && props.funcao == funcao}
      onPress={buttonFunction}
      style={{}}
      leftTitle="OFF"
      rightTitle="ON"
      trackBar={{
        activeBackgroundColor: '#2c8af2',
        inActiveBackgroundColor: '#a1a1a1',
        borderActiveColor: '#2277da',
        borderInActiveColor: '#585858',
        borderWidth: 3,
        width: 120,
      }}
      thumbButton={{
        activeBackgroundColor: '#e4e4e4',
        inActiveBackgroundColor: '#e4e4e4',
      }}
    />
  )
}
