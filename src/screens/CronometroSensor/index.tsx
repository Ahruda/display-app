import { useContext } from 'react'
import { Text, View } from 'react-native'
import { ConfigContext } from '../../contexts/config'
import ButtonFunctionToggle from '../../global/components/ButtonFunctionToggle'
import Display from '../../global/components/Display'
import { Header, Titulo } from '../../global/styles'

export default function CronometroSensor() {
  const { funcao } = useContext(ConfigContext)

  if (funcao !== 2) {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Header>
          <Titulo>Sensores</Titulo>
          <ButtonFunctionToggle funcao={2}></ButtonFunctionToggle>
        </Header>
      </View>
    )
  } else {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Header>
          <Titulo>Sensores</Titulo>
          <ButtonFunctionToggle funcao={2}></ButtonFunctionToggle>
        </Header>

        <Text>Aguardando ultimo sensor....</Text>
      </View>
    )
  }
}
