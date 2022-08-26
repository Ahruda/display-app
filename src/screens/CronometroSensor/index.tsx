import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, ScrollView, Text, View } from 'react-native'
import { ConfigContext } from '../../contexts/config'
import BotaoAtualizarDisplay from '../../global/components/BotaoAtualizarDisplay'
import ButtonFunctionToggle from '../../global/components/ButtonFunctionToggle'
import Display from '../../global/components/Display'
import { Header, Titulo } from '../../global/styles'
import { Linha, Scroll, Status, TabelaDados } from './styles'

export default function CronometroSensor() {
  const { funcao, estadoDisplay,ip } = useContext(ConfigContext)
  const [dadosSensor, setDadosSensor] = useState<number[]>([])
  const [statusSensores, setStatusSensores] = useState(0)
  const [statusRequisicao, setStatusRequisicao] = useState(0)
  const [numero, setNumero] = useState(1)

  function timeout(delay: number) {
    return new Promise( res => {
      setTimeout(res, delay)
    });
  }

  const iniciarSensores = () => {
    axios.post(`http://192.168.200.184/iniciarSensores`, {}).then(function (response) {
      if (response.status === 200) {
        setStatusSensores(0)
        setStatusRequisicao(1)
        verificarDadosSensores()
        
      }
    })
  }

  const interromperSensores = () => {
    axios.post(`http://192.168.200.184/iniciarSensores`, {}).then(function (response) {
      if (response.status === 200) {
        setStatusSensores(0)
        setStatusRequisicao(1)
        verificarDadosSensores()
        
      }
    })
  }

  const verificarDadosSensores =  () => {
    axios
      .get(`http://192.168.200.184/dadosSensores`)
      .then(function (response) {
        if (response.status === 200) {
          setDadosSensor(response.data)
           verificarStatusSensores()
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const verificarStatusSensores = ()  => {
    axios
      .get(`http://192.168.200.184/statusSensores`)
      .then(async function (response) {

        console.log('entrou no timeout')
        await timeout(2000);
        console.log('saiu do timeout')

        if (response.status === 200 && response.data["sensores_finalizados"] == 0) {
          verificarDadosSensores()
        } 

        if(response.data["sensores_finalizados"] == 1) {

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
      
          setStatusSensores(1)        
        }
      })
      .catch(function (error) {
        console.log(error)
      })

  }

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
        
        <BotaoAtualizarDisplay
            onPressFunction={statusSensores == 1 ? iniciarSensores :  statusRequisicao == 1 ? interromperSensores : iniciarSensores}
            titulo={statusSensores == 1 ? 'Reiniciar Sensores' :  statusRequisicao == 1 ? 'Interromper Sensores' : 'Iniciar Sensores'}
          ></BotaoAtualizarDisplay>

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

          

        {/* <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ paddingRight: 10 }}
          /> */}
        
        <Status>Status: </Status>  
        {statusSensores == 1 ? <Status>Sensores Finalizados!</Status> : <Status>Coletando dados...</Status>}
        
        </View>

        <Scroll
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 150 }}
        >

          <TabelaDados>
            <Text style={{ paddingBottom: 10}}>Dados dos sensores</Text>
          

            {dadosSensor.map((item, index) => {
              
              return (
                <Linha key={index + 1}>
                  <Text>Sensor #{index + 1}</Text>
                  <Text>{item} ms</Text>
                </Linha>
              )
            })}

          </TabelaDados>

        </Scroll>


      </View>
    )
  }
}
