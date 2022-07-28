import styled from 'styled-components/native'

export const ViewWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
`
export const ContainerModal = styled.View`
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: #ffffff;
  border-radius: 7;
  padding: 22px;
`
export const ModalInputs = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
export const TextInputTime = styled.TextInput`
  border-radius: 5;
  padding: 10px;
  margin: 0 5px;
  border-color: rgba(0, 0, 0, 0.2);
  border-width: 1;
  margin-bottom: 8;
  font-family: 'seven-segment';
  font-size: 30;
`
export const ModalButtons = styled.View`
  margin: 30px 0 0 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const TextDecimal = styled.Text`
  font-size: 26px;
`
