import { View } from 'react-native'
import ButtonFunctionToggle from '../../global/components/ButtonFunctionToggle'
import Display from '../../global/components/Display'
import { Header, Titulo } from '../../global/styles'

export default function CronometroSensor() {
  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Header>
        <Titulo>Sensores</Titulo>
        <ButtonFunctionToggle></ButtonFunctionToggle>
      </Header>
    </View>
  )
}
