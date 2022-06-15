import * as React from 'react'
import { Text, View } from 'react-native'
import { Container } from '../../global/components/Container/styles'
import { ContainerPlacar, PlacarTime, NomeTime, NumeroTime } from './styles'

export default function Placar() {
  return (
    <Container>
      <ContainerPlacar>
        <PlacarTime>
          <NomeTime>Time A</NomeTime>
          <NumeroTime>05</NumeroTime>
        </PlacarTime>
        <PlacarTime>
          <NomeTime>Time B</NomeTime>
          <NumeroTime>12</NumeroTime>
        </PlacarTime>
      </ContainerPlacar>
    </Container>
  )
}
