import styled from 'styled-components/native'

export const ViewWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
`
export const ContainerModal = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 35px 0;
`
export const ModalInputs = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
export const TextInputTime = styled.Text`
  font-size: 36px;
  text-align: center;
  border-radius: 5px;
  padding: 10px;
  border-color: rgba(0, 0, 0, 0.2);
  border-width: 1px;
  width: 40px;
  font-family: 'seven-segment';
`
export const ButtonInput = styled.TouchableOpacity`
  background-color: #2c8af2;
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-color: rgba(0, 0, 0, 0.2);
  font-size: 30px;
  width: 100%;
  height: 30px;
  padding: 0px;
  border-radius: 5px;
`
export const ModalButtons = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 0 25px;
`
export const TextDecimal = styled.Text`
  font-size: 26px;
`
export const TextoDigito = styled.Text`
  color: white;
  font-size: 36px;
  position: absolute;
  font-family: 'seven-segment';
`
export const ContainerNumero = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 15px 5px;
`