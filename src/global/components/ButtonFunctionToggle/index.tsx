import Toggle from 'react-native-toggle-element'

export default function ButtonFunctionToggle() {
  return (
    <Toggle
      value={true}
      //onPress={}
      style={{}}
      leftTitle="OFF"
      rightTitle="ON"
      trackBar={{
        activeBackgroundColor: '#2c8af2',
        inActiveBackgroundColor: '#a1a1a1',
        borderActiveColor: '#2277da',
        borderInActiveColor: '#585858',
        borderWidth: 3,
        width: 120,
      }}
      thumbButton={{
        activeBackgroundColor: '#e4e4e4',
        inActiveBackgroundColor: '#e4e4e4',
      }}
    />
  )
}
