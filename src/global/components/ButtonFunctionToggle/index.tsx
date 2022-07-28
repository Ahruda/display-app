import Toggle from 'react-native-toggle-element'

export default function ButtonFunctionToggle() {
    return(
        <Toggle
            value={true}
            //onPress={}
            leftTitle="OFF"
            rightTitle="ON"
            trackBar={{
            activeBackgroundColor: '#9ee3fb',
            inActiveBackgroundColor: '#3c4145',
            borderActiveColor: '#86c3d7',
            borderInActiveColor: '#1c1c1c',
            borderWidth: 5,
            width: 100
            }}
        />
    )
}