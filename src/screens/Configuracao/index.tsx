import { useState } from 'react'
import { Text, View } from 'react-native'
import MaskInput from 'react-native-mask-input'

import BotaoAtualizarDisplay from '../../global/components/BotaoAtualizarDisplay'
import ButtonFunctionToggle from '../../global/components/ButtonFunctionToggle'
import { Container } from '../../global/components/Container/styles'
import Display from '../../global/components/Display'
import { Input } from './styles'

const IP_MASK = [
  /\d/,
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
]

export default function Configuracao() {
  const [ip, setIp] = useState('')
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
      }}
    >
      <Text>Escreva aqui o IP do display</Text>
      <MaskInput
        placeholder="IP do display"
        keyboardType="numeric"
        onChangeText={setIp}
        value={ip}
        mask={IP_MASK}
      />
      <BotaoAtualizarDisplay></BotaoAtualizarDisplay>
    </View>
  )
}
