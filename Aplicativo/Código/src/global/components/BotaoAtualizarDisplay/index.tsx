import { BtnGeral, TextBtn } from '../../styles'

interface botaoAtualizarProps {
  onPressFunction(): void
  disable?: boolean
  titulo: string
}

export default function BotaoAtualizarDisplay(props: botaoAtualizarProps) {
  return (
    <BtnGeral onPress={props.onPressFunction} disabled={props.disable}>
      <TextBtn>{props.titulo}</TextBtn>
    </BtnGeral>
  )
}
