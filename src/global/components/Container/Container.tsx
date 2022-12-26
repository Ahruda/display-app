import { useContext } from "react";
import { ConfigContext } from "../../../contexts/config";
import { ContainerScroll, ContainerView } from "./styles";

type Props = {
    funcaoTela: number,
    children: JSX.Element,
};

export default function Container({ funcaoTela, children }: Props) {

    const {funcao, estadoDisplay} = useContext(ConfigContext)

    return (
        <ContainerScroll style={{display: (funcao == funcaoTela && estadoDisplay == 1 ? 'flex' : 'none' )}}>       
            <ContainerView>
                {children}
            </ContainerView>
        </ContainerScroll>
    )
}