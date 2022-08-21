import { BtnGeral, TextBtn } from '../../styles'

interface botaoAtualizarProps {
  onPressFunction(): void
}

export default function BotaoAtualizarDisplay(props: botaoAtualizarProps) {
  return (
    <BtnGeral onPress={props.onPressFunction}>
      <TextBtn>Atualizar Display</TextBtn>
    </BtnGeral>
  )
}
