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
}

export const ConfigContext = createContext<configContextProps>({})

export function ConfigProvider({ children }: any) {
  const [funcao, setFuncao] = useState(0)
  const [estadoDisplay, setEstadoDisplay] = useState(0)
  const [ip, setIp] = useState('')

  useEffect(() => {
    axios
    .post(`http://${ip}/alterarfuncao`, {
      "estado_display": estadoDisplay,
      "funcao": funcao
  })
    .then(function (response) {
      if (response.status === 200) {
        
      }
    })
  }, [funcao, estadoDisplay])

  return (
    <ConfigContext.Provider
      value={{ funcao, setFuncao, estadoDisplay, setEstadoDisplay, ip, setIp }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
