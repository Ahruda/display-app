import { useState } from 'react'
import { Text, View } from 'react-native'
import MaskInput from 'react-native-mask-input'
import axios from 'axios'

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

  const atualizarDisplay = () => {
    axios
      .post(`http://${ip}/delay`, {
        delay: 1,
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log('sucesso')
        }
      })
      .catch(function (error) {
        console.log('Erro')
      })
  }

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
      <BotaoAtualizarDisplay
        onPressFunction={atualizarDisplay}
      ></BotaoAtualizarDisplay>
    </View>
  )
}
