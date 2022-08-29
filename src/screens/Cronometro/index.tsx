import React, { useContext, useEffect, useState } from 'react'

import { Dimensions, View, Modal, Text, Button } from 'react-native'
import ButtonFunctionToggle from '../../global/components/ButtonFunctionToggle'

import {} from 'react-native'
import {
  ContainerModal,
  ModalButtons,
  ModalInputs,
  TextDecimal,
  ButtonInput,
  ContainerNumero,
  ViewWrapper,
  TextInputTime,
  TextoDigito,
} from './styles'
import { BtnGeral, TextBtn, Titulo, Header } from '../../global/styles'
import { ConfigContext } from '../../contexts/config'
import axios from 'axios'

const { width } = Dimensions.get('window')

export default function Cronometro() {
  const { funcao, estadoDisplay, ip } = useContext(ConfigContext)

  const [isModalVisible, setModalVisible] = useState(false)
  const [estadoTimer, setEstadoTimer] = useState(false)

  const [numero1, setNumero1] = useState(0)
  const [numero2, setNumero2] = useState(0)
  const [numero3, setNumero3] = useState(0)
  const [numero4, setNumero4] = useState(0)
  const [numero5, setNumero5] = useState(0)
  const [numero6, setNumero6] = useState(0)

  const toggleModalVisibility = () => {
    if(funcao == 1 && estadoDisplay == 1){
      setModalVisible(!isModalVisible)
    }
  }

  const changeStateTimer = () => {
    if(funcao == 1 && estadoDisplay == 1){
      axios
      .post(`http://${ip}/pausarCronometro`, {})
      .then(function (response) {
        if (response.status === 200) {
          estadoTimer ? setEstadoTimer(false) : setEstadoTimer(true)
        }
      })
    }
  }

  const restartTimer = () => {
    if(funcao == 1 && estadoDisplay == 1){
    axios
      .post(`http://${ip}/reiniciarCronometro`, {})
      .then(function (response) {
        if (response.status === 200) {
          console.log('sucesso')
        }
      })
      .catch(function (error) {
        console.log('Erro')
      })
    }
  }

  const definirTimer = () => {
    let segundos = 0
    let minutos = 0
    let horas = 0

    segundos +=  numero2 * 10 + numero1
    minutos += numero4 * 10 + numero3
    horas += numero6 * 10 + numero5


    minutos = minutos + horas * 60
    segundos = segundos + minutos * 60

    console.log(segundos)

    if(funcao == 1 && estadoDisplay == 1){
      toggleModalVisibility
      axios
      .post(`http://${ip}/alterarNumeros`, {
        "segundos": segundos
      })
      .then(function (response) {
        if (response.status === 200) {
        }
      })
      .catch(function (error) {
        console.log('Erro')
      })
    }
  }


  return(
      <View
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Header>
        <Titulo>Cronometro</Titulo>
        <ButtonFunctionToggle funcao={1}></ButtonFunctionToggle>
      </Header>
      <BtnGeral
        style={{ marginBottom: 20, marginTop: 50 }}
        onPress={changeStateTimer}
        
      >
        <TextBtn>{estadoTimer ? 'Pausar' : 'Iniciar'}</TextBtn>
      </BtnGeral>
      <BtnGeral style={{ marginBottom: 20 }} onPress={restartTimer}>
        <TextBtn>Reiniciar</TextBtn>
      </BtnGeral>
      <BtnGeral style={{ marginBottom: 20 }} onPress={toggleModalVisibility}>
        <TextBtn>Definir tempo</TextBtn>
      </BtnGeral>

      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={toggleModalVisibility}
      >
        <ViewWrapper>
          <ContainerModal>

            <Text style={{fontSize:24, marginBottom:10, marginTop:20}}>Definir Tempo</Text>

            <ModalInputs>

              <ContainerNumero>
                <ButtonInput onPress={ () => numero6 == 9 ? setNumero6(0) : setNumero6(numero6 + 1)}><TextoDigito>+</TextoDigito></ButtonInput>
                <TextInputTime>{numero6}</TextInputTime>
                <ButtonInput onPress={ () => numero6 == 0 ? setNumero6(9) : setNumero6(numero6 - 1)}><TextoDigito>-</TextoDigito></ButtonInput>
              </ContainerNumero>
              
              <ContainerNumero>
                <ButtonInput onPress={ () => numero5 == 9 ? setNumero5(0) : setNumero5(numero5 + 1)}><TextoDigito>+</TextoDigito></ButtonInput>
                <TextInputTime>{numero5}</TextInputTime>
                <ButtonInput onPress={ () => numero5 == 0 ? setNumero5(9) : setNumero5(numero5 - 1)}><TextoDigito>-</TextoDigito></ButtonInput>
              </ContainerNumero>

              <Text style={{fontSize:26}}>:</Text>

              <ContainerNumero>
                <ButtonInput onPress={ () => numero4 == 5 ? setNumero4(0) : setNumero4(numero4 + 1)}><TextoDigito>+</TextoDigito></ButtonInput>
                <TextInputTime>{numero4}</TextInputTime>
                <ButtonInput onPress={ () => numero4 == 0 ? setNumero4(5) : setNumero4(numero4 - 1)}><TextoDigito>-</TextoDigito></ButtonInput>
              </ContainerNumero>

              <ContainerNumero>
                <ButtonInput onPress={ () => numero3 == 9 ? setNumero3(0) : setNumero3(numero3 + 1)}><TextoDigito>+</TextoDigito></ButtonInput>
                <TextInputTime>{numero3}</TextInputTime>
                <ButtonInput onPress={ () => numero3 == 0 ? setNumero3(9) : setNumero3(numero3 - 1)}><TextoDigito>-</TextoDigito></ButtonInput>
              </ContainerNumero>

              <Text style={{fontSize:26}}>:</Text>

              <ContainerNumero>
                <ButtonInput onPress={ () => numero2 == 5 ? setNumero2(0) : setNumero2(numero2 + 1)}><TextoDigito>+</TextoDigito></ButtonInput>
                <TextInputTime>{numero2}</TextInputTime>
                <ButtonInput onPress={ () => numero2 == 0 ? setNumero2(5) : setNumero2(numero2 - 1)}><TextoDigito>-</TextoDigito></ButtonInput>
              </ContainerNumero>

              <ContainerNumero>
                <ButtonInput onPress={ () => numero1 == 9 ? setNumero1(0) : setNumero1(numero1 + 1)}><TextoDigito>+</TextoDigito></ButtonInput>
                <TextInputTime>{numero1}</TextInputTime>
                <ButtonInput onPress={ () => numero1 == 0 ? setNumero1(9) : setNumero1(numero1 - 1)}><TextoDigito>-</TextoDigito></ButtonInput>
              </ContainerNumero>


            </ModalInputs>
            <ModalButtons>
              <BtnGeral
                onPress={toggleModalVisibility}
                style={{ width: '40%', height: '55%', marginRight: '5%' }}
              >
                <TextBtn>Cancelar</TextBtn>
              </BtnGeral>
              <BtnGeral
                onPress={definirTimer}
                style={{ width: '40%', height: '55%', marginLeft: '5%' }}
              >
                <TextBtn>Confirmar</TextBtn>
              </BtnGeral>
            </ModalButtons>
          </ContainerModal>
        </ViewWrapper>
      </Modal>
    </View>
    )
}
