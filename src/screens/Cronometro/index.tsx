import React, { useEffect, useState } from 'react'

import { Dimensions, View, Modal, Text } from 'react-native'
import ButtonFunctionToggle from '../../global/components/ButtonFunctionToggle'

import {} from 'react-native'
import {
  ContainerModal,
  ModalButtons,
  ModalInputs,
  TextDecimal,
  TextInputTime,
  ViewWrapper,
} from './styles'
import Display from '../../global/components/Display'
import { BtnGeral, TextBtn, Titulo, Header } from '../../global/styles'

const { width } = Dimensions.get('window')

export default function Cronometro() {
  const [isModalVisible, setModalVisible] = useState(false)
  const [estadoTimer, setEstadoTimer] = useState(false)

  const [inputValue1, setInputValue1] = useState('')
  const [inputValue2, setInputValue2] = useState('')
  const [inputValue3, setInputValue3] = useState('')
  const [inputValue4, setInputValue4] = useState('')
  const [inputValue5, setInputValue5] = useState('')
  const [inputValue6, setInputValue6] = useState('')

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible)
  }

  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Header>
        <Titulo>Cronometro</Titulo>
        <ButtonFunctionToggle></ButtonFunctionToggle>
      </Header>

      <BtnGeral
        style={{ marginBottom: 20, marginTop: 50 }}
        onPress={() =>
          estadoTimer ? setEstadoTimer(false) : setEstadoTimer(true)
        }
      >
        <TextBtn>{estadoTimer ? 'Pausar' : 'Iniciar'}</TextBtn>
      </BtnGeral>
      <BtnGeral style={{ marginBottom: 20 }}>
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
            <ModalInputs>
              <TextInputTime
                value={inputValue1}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(value) => setInputValue1(value)}
              />
              <TextInputTime
                value={inputValue2}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(value) => setInputValue2(value)}
              />
              <TextDecimal>:</TextDecimal>
              <TextInputTime
                value={inputValue3}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(value) => setInputValue3(value)}
              />
              <TextInputTime
                value={inputValue4}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(value) => setInputValue4(value)}
              />
              <TextDecimal>:</TextDecimal>
              <TextInputTime
                value={inputValue5}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(value) => setInputValue5(value)}
              />
              <TextInputTime
                value={inputValue6}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(value) => setInputValue6(value)}
              />
            </ModalInputs>
            <ModalButtons>
              <BtnGeral
                onPress={toggleModalVisibility}
                style={{ width: '40%', height: '55%', marginRight: '5%' }}
              >
                <TextBtn>Cancelar</TextBtn>
              </BtnGeral>
              <BtnGeral
                onPress={toggleModalVisibility}
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
