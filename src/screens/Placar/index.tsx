import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ConfigContext } from '../../contexts/config'
import BotaoAtualizarDisplay from '../../global/components/BotaoAtualizarDisplay'
import ButtonFunctionToggle from '../../global/components/ButtonFunctionToggle'
import { Container } from '../../global/components/Container/styles'
import Display from '../../global/components/Display'
import { Header } from '../../global/styles'
import {
  ContainerTime,
  PlacarTime,
  Button,
  Titulo,
  ContainerPlacar,
} from './styles'

export default function Placar() {
  const { ip } = useContext(ConfigContext)
  const [timeA, setTimeA] = useState(0)
  const [timeB, setTimeB] = useState(0)

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

  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Header>
        <Titulo>Placar</Titulo>
        <ButtonFunctionToggle funcao={3}></ButtonFunctionToggle>
      </Header>

      <ContainerTime>
        <Titulo>Time A</Titulo>
        <ContainerPlacar>
          <Button title="-3" onPress={() => setTimeA(timeA - 3)} />
          <Button title="-2" onPress={() => setTimeA(timeA - 2)} />
          <Button title="-1" onPress={() => setTimeA(timeA - 1)} />

          <PlacarTime>{timeA}</PlacarTime>
          <Button title="+1" onPress={() => setTimeA(timeA + 1)} />
          <Button title="+2" onPress={() => setTimeA(timeA + 2)} />
          <Button title="+3" onPress={() => setTimeA(timeA + 3)} />
        </ContainerPlacar>
        <Button title="Zerar placar" onPress={() => setTimeA(0)} />
      </ContainerTime>
      <ContainerTime>
        <Titulo>Time B</Titulo>
        <ContainerPlacar>
          <Button title="-3" onPress={() => setTimeB(timeB - 3)} />
          <Button title="-2" onPress={() => setTimeB(timeB - 2)} />
          <Button title="-1" onPress={() => setTimeB(timeB - 1)} />

          <PlacarTime>{timeB}</PlacarTime>
          <Button title="+1" onPress={() => setTimeB(timeB + 1)} />
          <Button title="+2" onPress={() => setTimeB(timeB + 2)} />
          <Button title="+3" onPress={() => setTimeB(timeB + 3)} />
        </ContainerPlacar>
        <Button title="Zerar placar" onPress={() => setTimeB(0)} />

      </ContainerTime>
      <BotaoAtualizarDisplay
        onPressFunction={updateDisplay}
        titulo="Atualizar display"
      ></BotaoAtualizarDisplay>
    </View>
  )
}
