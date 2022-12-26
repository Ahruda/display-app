import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, ScrollView, Text, View } from 'react-native'
import { ConfigContext } from '../../contexts/config'
import BotaoAtualizarDisplay from '../../global/components/BotaoAtualizarDisplay'
import ButtonFunctionToggle from '../../global/components/ButtonFunctionToggle'
import { Header, Titulo } from '../../global/styles'
import {Linha, SubTitulo, TabelaDados, TabelaRadio } from './styles'
import { RadioButton, Text as TextRadio } from 'react-native-paper';
import Container from '../../global/components/Container/Container'


export default function CronometroSensor() {
  const { funcao, estadoDisplay, ip } = useContext(ConfigContext)
  const [dadosSensor, setDadosSensor] = useState<number[]>([])
  const [statusSensores, setStatusSensores] = useState(0) // 0 para sensores não finalizados
  const [statusRequisicao, setStatusRequisicao] = useState(0) // 1 para req em andamento
  const [tipoAcionamento, setTipoAcionamento] = useState('botao');
  
  //const [numero, setNumero] = useState(1)

  function timeout(delay: number) {
    return new Promise( res => {
      setTimeout(res, delay)
    });
  }

  const iniciarSensores = () => {
    if(funcao == 2 && estadoDisplay == 1){
      axios.post(`http://${ip}/iniciarSensores`, {}).then(function (response) {
        if (response.status === 200) {
          setStatusSensores(0) // sensores não finalizaram
          setStatusRequisicao(1) // requisicao em andamento
          verificarDadosSensores()
        }
      })
    }
  }

  const interromperSensores = () => {
    if(funcao == 2 && estadoDisplay == 1){
      axios.post(`http://${ip}/interromperSensores`, {})
      .then(function (response) {
      })
    }
  }

  const verificarDadosSensores =  () => {
    if(funcao == 2 && estadoDisplay == 1){
      axios
      .get(`http://${ip}/dadosSensores`)
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
  }

  const verificarStatusSensores = () => {
    if(funcao == 2 && estadoDisplay == 1){
    axios
      .get(`http://${ip}/statusSensores`)
      .then(async function (response) {

        console.log('entrou no timeout ' +estadoDisplay)
        await timeout(2000);
        console.log('saiu do timeout')

        if (response.status === 200 && response.data["sensores_finalizados"] == 0) {
          verificarDadosSensores()
        } 

        if(response.data["sensores_finalizados"] == 1) {

          axios
          .get(`http://${ip}/dadosSensores`)
          .then(function (response) {
            if (response.status === 200) {
              console.log("ultima rotina---------------")
              setDadosSensor(response.data)
              setStatusSensores(1)        
              setStatusRequisicao(0)
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  }
    
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >

      <Header style={{marginBottom:20}}>
        <Titulo>Sensores</Titulo>
        <ButtonFunctionToggle funcao={2}></ButtonFunctionToggle>
      </Header>

      <Container funcaoTela={2}>
        <>
          <SubTitulo>Modos de acionamento</SubTitulo>

          <TabelaRadio>
            <RadioButton.Group onValueChange={newValue => setTipoAcionamento(newValue)} value={tipoAcionamento}>
              <RadioButton.Item label="Botão" value="botao" />
              <RadioButton.Item label="Primeiro Sensor" value="sensor" />
            </RadioButton.Group>

            <BotaoAtualizarDisplay
              onPressFunction = {
                statusSensores == 1 
                  ? iniciarSensores 
                  :  statusRequisicao == 1 && funcao == 2 && estadoDisplay == 1
                    ? interromperSensores 
                    : iniciarSensores}
              titulo = {
                statusSensores == 1 
                  ? 'Reiniciar Sensores' 
                  : statusRequisicao == 1 && funcao == 2 && estadoDisplay == 1
                    ? 'Interromper Sensores' 
                    : 'Iniciar Sensores'}

            ></BotaoAtualizarDisplay>

          </TabelaRadio>

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

          {/*
          <Status>Status: </Status>  

          {(funcao == 2 && estadoDisplay == 1 && statusRequisicao == 1) 
            ? (statusSensores == 1 )
              ? <Status>Sensores Finalizados!</Status> 
              : <Status>Coletando dados...</Status>
            : <Status>Sensores desabilitados!</Status>}

          */}
          </View>

          <SubTitulo>Dados dos sensores</SubTitulo>
          <TabelaDados>
            {dadosSensor.map((item, index) => {
              
              return (
                <Linha key={index + 1}>
                  <Text>Sensor #{index + 1}</Text>
                  <Text>{item} ms</Text>
                </Linha>
              )
            })}
          </TabelaDados>
        </>
      </Container>
    </View>
  )
}

