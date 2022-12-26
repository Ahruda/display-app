import styled from 'styled-components/native'

export const BtnGeral = styled.TouchableOpacity`
  background-color: #2c8af2;
  border-radius: 10px;
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

`
export const TextBtn = styled.Text`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
`
export const Header = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  padding: 10px 0;
  border: 1px;
`
export const Titulo = styled.Text`
  font-size: 20px;
`
export const TituloApp = styled.Text`
font-family: 'seven-segment';
  font-size: 45px;
  text-align: center;
  padding: 15px 0px 0px 0px;
`
export const SubTituloApp = styled.Text`
  font-family: 'seven-segment';
  font-size: 10px;
  text-align: center;
  padding: 0px 0px 10px 0;
`
export const Container = styled.ScrollView`
  width: 90%;
  height: 100%;
`