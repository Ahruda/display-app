import { useContext, useState } from 'react'
import { Text, ToastAndroid, View } from 'react-native'
import MaskInput from 'react-native-mask-input'
import axios from 'axios'

import BotaoAtualizarDisplay from '../../global/components/BotaoAtualizarDisplay'
import ButtonFunctionToggle from '../../global/components/ButtonFunctionToggle'
import { Container } from '../../global/components/Container/styles'
import Display from '../../global/components/Display'
import { Input } from './styles'
import { ConfigContext } from '../../contexts/config'

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

  const [ipMask, setIpMask] = useState('')
  const { setIp, ip } = useContext(ConfigContext)

  const showToast = (mensagem: string) => {
    ToastAndroid.show(mensagem, ToastAndroid.SHORT)
  }

  const atualizarDisplay = () => {

    setIp(ipMask)

    axios
    .get(`http://${ip}/statusSensores`)
    .then(function (response) {
      if (response.status === 200) {
        showToast("Conexão feita com sucesso!")
      }
    })
    .catch(function (error) {
      showToast("Ocorreu um erro ao realizar a conexão no IP informado")
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
        onChangeText={setIpMask}
        value={ipMask}
        mask={IP_MASK}
      />
      <BotaoAtualizarDisplay
        onPressFunction={atualizarDisplay}
        titulo="Atualizar configuração"
      ></BotaoAtualizarDisplay>
    </View>
  )
}
