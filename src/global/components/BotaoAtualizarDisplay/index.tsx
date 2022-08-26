import { BtnGeral, TextBtn } from '../../styles'

interface botaoAtualizarProps {
  onPressFunction(): void
  titulo: string
}

export default function BotaoAtualizarDisplay(props: botaoAtualizarProps) {
  return (
    <BtnGeral onPress={props.onPressFunction}>
      <TextBtn>{props.titulo}</TextBtn>
    </BtnGeral>
  )
}
