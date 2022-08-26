import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, ScrollView, Text, View } from 'react-native'
import { ConfigContext } from '../../contexts/config'
import BotaoAtualizarDisplay from '../../global/components/BotaoAtualizarDisplay'
import ButtonFunctionToggle from '../../global/components/ButtonFunctionToggle'
import Display from '../../global/components/Display'
import { Header, Titulo } from '../../global/styles'
import { Linha, Scroll, Status } from './styles'

export default function CronometroSensor() {
  const { funcao, estadoDisplay } = useContext(ConfigContext)
  const [dados, setDados] = useState<any[]>([])
  const [dadosSensor, setDadosSensor] = useState<number[]>([])
  const [status, setStatus] = useState(0)
  const [numero, setNumero] = useState(0)

  const MINUTE_MS = 60000;

 

  const reiniciarSensores = () => {
    axios.post(`http://${ip}/alterarNumeros`, {}).then(function (response) {
      if (response.status === 200) {
      }
    })
  }

  const dadosSensores = () => {
    axios
      .get(`http://192.168.200.184/dadosSensores`)
      .then(function (response) {
        if (response.status === 200) {
          setDadosSensor(response.data)
          console.log("entrou em dados sensores")
          statusSensores()
        }

      })
      .catch(function (error) {
        console.log(error)
      })
      console.log("saiu de dados sensores")
  }

  
  const statusSensores = () => {
    axios
      .get(`http://192.168.200.184/statusSensores`)
      .then(function (response) {
        if (response.status === 200 && response.data["sensores_finalizados"] == 0) {
          console.log("entrou em status sensores")
          dadosSensores()
        } else if (response.data["sensores_finalizados"] == 1){
          setStatus(1)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
      console.log("saiu de status sensores")

  }

  useEffect(() => {
    axios
      .get(`http://192.168.200.184/dadosSensores`)
      .then(function (response) {
        if (response.status === 200) {
          setDadosSensor(response.data)
        }
      })
      .catch(function (error) {
        console.log(error)
      })

  }, [status]);

  if (funcao !== 2 && estadoDisplay === 0) {
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

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '80%',
            alignItems: 'center',
            padding: 10,
          }}
        >
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ paddingRight: 10 }}
          />
          
          <Status>{status == 1 ? 'Sensores finalizados' : 'Coletando dados ...'}</Status>
        </View>

        <Scroll
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 150 }}
        >
          {dadosSensor.map((item) => {
            return (
              <Linha key={numero}>
                <Text>Sensor #{numero}</Text>
                <Text>{item}</Text>
              </Linha>
            )
          })}
          <BotaoAtualizarDisplay
            onPressFunction={() => statusSensores}
            titulo="Reiniciar sensores"
          ></BotaoAtualizarDisplay>
          <Button title='Teste' onPress={dadosSensores}></Button>
        </Scroll>
      </View>
    )
  }
}
