import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ConfigContext } from '../../contexts/config'
import BotaoAtualizarDisplay from '../../global/components/BotaoAtualizarDisplay'
import ButtonFunctionToggle from '../../global/components/ButtonFunctionToggle'
import Display from '../../global/components/Display'
import { Header } from '../../global/styles'
import {
  ContainerTime,
  PlacarTime,
  Button,
  Titulo,
  ContainerPlacar,
} from './styles'
import Container from '../../global/components/Container/Container'

export default function Placar() {
  const { ip } = useContext(ConfigContext)
  const [timeA, setTimeA] = useState(0)
  const [timeB, setTimeB] = useState(0)

  useEffect(()=>{
    updateDisplay
  },[timeA,timeB]);

  const updateDisplay = () => {
    axios
      .post(`http://${ip}/alterarNumerosPlacar`, {
        numero_1: timeB % 10,
        numero_2: timeB / 10,
        numero_3: 0,
        numero_4: 0,
        numero_5: timeA % 10,
        numero_6: timeA / 10,
    })
    .then(function (response) {
      if (response.status === 200) {
      }
    })
  }

  const alterarTimeA = (numero: number) => {
    if(numero < 0) {
      setTimeA(0)
    } else if(numero > 99) {
      setTimeA(99)
    } else{
      setTimeA(numero)
    }
  }

  const alterarTimeB = (numero: number) => {
    if(numero < 0) {
      setTimeB(0)
    } else if(numero > 99) {
      setTimeB(99)
    } else {
      setTimeB(numero)
    }
  }

  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Header>
        <Titulo>Placar</Titulo>
        <ButtonFunctionToggle funcao={3}></ButtonFunctionToggle>
      </Header>

      <Container funcaoTela={3}>
        <>
          <ContainerTime>
            <Titulo>Time A</Titulo>
            <ContainerPlacar>
              <Button title="-3" onPress={() => alterarTimeA(timeA - 3)} />
              <Button title="-2" onPress={() => alterarTimeA(timeA - 2)} />
              <Button title="-1" onPress={() => alterarTimeA(timeA - 1)} />

              <PlacarTime style={{color:'green', borderColor:'green'}}>{timeA < 10 ? '0' + timeA : timeA}</PlacarTime>
              <Button title="+1" onPress={() => alterarTimeA(timeA + 1)} />
              <Button title="+2" onPress={() => alterarTimeA(timeA + 2)} />
              <Button title="+3" onPress={() => alterarTimeA(timeA + 3)} />
            </ContainerPlacar>
            <Button title="Zerar placar" onPress={() => setTimeA(0)} />
          </ContainerTime>

          <ContainerTime>
            <Titulo>Time B</Titulo>
            <ContainerPlacar>
              <Button title="-3" onPress={() => alterarTimeB(timeB - 3)} />
              <Button title="-2" onPress={() => alterarTimeB(timeB - 2)} />
              <Button title="-1" onPress={() => alterarTimeB(timeB - 1)} />

              <PlacarTime style={{color:'red', borderColor:'red'}}>{timeB < 10 ? '0' + timeB : timeB}</PlacarTime>
              <Button title="+1" onPress={() => alterarTimeB(timeB + 1)} />
              <Button title="+2" onPress={() => alterarTimeB(timeB + 2)} />
              <Button title="+3" onPress={() => alterarTimeB(timeB + 3)} />
            </ContainerPlacar>
            <Button title="Zerar placar" onPress={() => setTimeB(0)} />
          </ContainerTime>
        </>
      </Container>
    </View>
  )
}
