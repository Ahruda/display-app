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
  const [buttonState, setButtonState] = useState(false);
  
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
      axios
      .post(`http://${ip}/interromperSensores`, {})
      .then(res => {
          if (res.status === 200) {
            setButtonState(true)
          }
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

        await timeout(1000);

        if (response.status === 200 && response.data["sensores_finalizados"] == 0) {
          verificarDadosSensores()
        } 

        if(response.data["sensores_finalizados"] == 1) {
          setButtonState(false)
          axios
          .get(`http://${ip}/dadosSensores`)
          .then(function (response) {
            if (response.status === 200) {
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

  const mudarTipoAcionamento = (value: string) => {
    setTipoAcionamento(value)
    axios
    .post(`http://${ip}/tipoAcionamentoSensor`, {
      tipo_acionamento_sensor: (value == "botao") ? 0 : 1,
    })
    .then(function (response) {
      if (response.status === 200) {

      }
    })
  }

  const formatarDadosSensores = (mili: any) => {

    let m, resto, s, ms
    let vetorNumeros = []

    m = mili / 60000;
    resto = mili % 60000;
    s = resto / 1000;
    ms = resto % 1000;

    vetorNumeros[0] = (ms % 100);
    vetorNumeros[1] = ms / 100;

    vetorNumeros[2] = s % 10;
    vetorNumeros[3] = s / 10;

    vetorNumeros[4] = m % 10;
    vetorNumeros[5] = m / 10;

    let msg

    msg = ((vetorNumeros[5] === 0 ? '0' :  Math.trunc(vetorNumeros[5])) + "" + (vetorNumeros[4] === 0 ? '0' :  Math.trunc(vetorNumeros[4])))
    msg += "min " + ((vetorNumeros[3] === 0 ? '0' :  Math.trunc(vetorNumeros[3])) + "" + (vetorNumeros[2] === 0 ? '0' :  Math.trunc(vetorNumeros[2])))
    msg += "s " + ((vetorNumeros[1] === 0 ? '0' :  Math.trunc(vetorNumeros[1])) + "" + (vetorNumeros[0] === 0 ? '00' :  Math.trunc(vetorNumeros[0])))

    return msg+"ms"
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
            <RadioButton.Group onValueChange={newValue => mudarTipoAcionamento(newValue)} value={tipoAcionamento}>
              <RadioButton.Item label="Botão" value="botao" color='#2c8af2' 
              disabled={(statusRequisicao == 1 && funcao == 2 && estadoDisplay == 1) ? true : false} />
              <RadioButton.Item label="Primeiro Sensor" value="sensor" color='#2c8af2'
              disabled={(statusRequisicao == 1 && funcao == 2 && estadoDisplay == 1) ? true : false} />
            </RadioButton.Group>

            <BotaoAtualizarDisplay
              disable={buttonState}
              onPressFunction = {
                statusSensores == 1 
                  ? iniciarSensores 
                  :  statusRequisicao == 1 && funcao == 2 && estadoDisplay == 1
                    ? interromperSensores 
                    : iniciarSensores}
              titulo = {
                statusSensores == 1 
                  ? 'Reiniciar' 
                  : statusRequisicao == 1 && funcao == 2 && estadoDisplay == 1
                    ? 'Interromper' 
                    : 'Iniciar'}
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
          </View>

          <SubTitulo>Dados dos sensores</SubTitulo>
          <TabelaDados>
            {dadosSensor.map((item, index) => {
              return (
                <Linha key={index + 1}>
                  <Text style={{fontWeight:'400', fontSize:16}}>Sensor #{index + 1}</Text>
                  <Text style={{fontWeight:'400', fontSize:16}}>{formatarDadosSensores(item)}</Text>
                </Linha>
              )
            })}
          </TabelaDados>
        </> 
      </Container>
    </View>
  )
}

