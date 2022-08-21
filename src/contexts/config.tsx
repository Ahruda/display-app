import { useEffect } from 'react'
import { createContext, useState } from 'react'

interface configContextProps {
  funcao: number
  setFuncao: Function
  estadoDisplay: boolean
  setEstadoDisplay: Function
  ip: number
  setIp: Function
}

export const ConfigContext = createContext<configContextProps>({})

export function ConfigProvider({ children }: any) {
  const [funcao, setFuncao] = useState(0)
  const [estadoDisplay, setEstadoDisplay] = useState(false)
  const [ip, setIp] = useState(0)

  useEffect(() => {
    console.log('Funcao mudou para ' + funcao)
    //request para mudar funcao
  }, [funcao])

  useEffect(() => {
    console.log('Display mudou para ' + estadoDisplay)
    //request para mudar estadoDisplay
  }, [estadoDisplay])

  return (
    <ConfigContext.Provider
      value={{ funcao, setFuncao, estadoDisplay, setEstadoDisplay, ip, setIp }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
