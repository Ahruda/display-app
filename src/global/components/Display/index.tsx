import { Text } from 'react-native'
import { TextDecimal } from '../../../screens/Cronometro/styles'
import { ContainerNumeros, DisplayContainer, Numeros } from './styles'

export default function Display() {
  return (
    <DisplayContainer>
      <ContainerNumeros>
        <Numeros>00</Numeros>
        <Numeros>:</Numeros>
        <Numeros>00</Numeros>
        <Numeros>:</Numeros>
        <Numeros>00</Numeros>
      </ContainerNumeros>
      <Text>Estado atual do display</Text>
    </DisplayContainer>
  )
}
