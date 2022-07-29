import styled from 'styled-components/native'

export const DisplayContainer = styled.View`
  display: flex;
  flex-direction: column;
  //border: 1px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`

export const ContainerNumeros = styled.View`
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const Numeros = styled.Text`
  font-family: 'seven-segment';
  text-align: center;
  font-size: 46px;
`
