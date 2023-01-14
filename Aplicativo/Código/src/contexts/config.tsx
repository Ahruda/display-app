import axios from 'axios'
import { useEffect } from 'react'
import { createContext, useState } from 'react'

interface configContextProps {
  funcao: number
  setFuncao: Function
  estadoDisplay: number
  setEstadoDisplay: Function
  ip: string
  setIp: Function
  zerarDisplay: Function
}

export const ConfigContext = createContext<configContextProps>({})

export function ConfigProvider({ children }: any) {
  const [funcao, setFuncao] = useState(0)
  const [estadoDisplay, setEstadoDisplay] = useState(0)
  const [ip, setIp] = useState('192.168.004.001')

  const zerarDisplay = () => {
    axios
    .post(`http://${ip}/alterarfuncao`, {
      "estado_display": 0,
      "funcao": 0
    })
  }

  useEffect(() => {
    axios
    .post(`http://${ip}/alterarfuncao`, {
      "estado_display": estadoDisplay,
      "funcao": funcao
    })
  }, [funcao, estadoDisplay])

  return (
    <ConfigContext.Provider
      value={{ funcao, setFuncao, estadoDisplay, setEstadoDisplay, ip, setIp, zerarDisplay }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
