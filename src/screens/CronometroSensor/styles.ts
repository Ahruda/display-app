import styled from 'styled-components/native'

export const ContainerModal = styled.View`
  align-items: center;
  justify-content: center;
  position: absolute;
  top: '50%';
  left: '50%';
  height: 180;
  width: width * 0.8;
  background-color: #fff;
  border-radius: 7;
`

export const Linha = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 80%;
  border-bottom-width: 1px;
  padding-top: 10px;
`

export const Status = styled.Text`
  font-size: 16px;
  font-weight: bold;
`

export const SubTitulo = styled.Text`
  font-size: 16px;
  font-weight: bold;
`

export const TabelaDados = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px;
  padding: 10px;
  margin-bottom: 56px;
`

export const TabelaRadio = styled.View`
  display: flex;
  flex-direction: column;
  border: 1px;
  padding: 5px;
  margin-bottom: 10px;
`
