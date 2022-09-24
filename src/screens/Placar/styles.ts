//<div style=display: 'flex', alignItems: 'center', justify{Content: ''}></div>

import styled from 'styled-components/native'

export const ContainerPlacar = styled.View`
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border: 1px;
  padding: 25px 0;
`

export const ContainerTime = styled.View`
  margin: 25px 0 25px 0;
`
export const NomeTime = styled.Text`
  font-size: 13px;
`
export const PlacarTime = styled.Text`
  width: 60px;
  text-align: center;
  font-family: 'seven-segment';
  border: 1px;
  padding: 0px;
  font-size: 46px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
export const Button = styled.Button`
  font-size: 33px;
`
export const Titulo = styled.Text`
  font-size: 23px;
  text-align: center;
`
