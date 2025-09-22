import React, {useState, useRef, useEffect} from 'react'
import { View, Text } from 'react-native'
import {CameraView, CameraType, useCameraPermissions} from 'expo-camera'

const visualizerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const cameraRef = useRef<CameraView | null>(null)
  const [facing] = useState<CameraType>('back');

  useEffect(() => {
    requestPermission();
  }, []);

  if(!permission){
    return <View className='flex-1 items-center justify-center'><Text>Loading...</Text></View>
  }

  return (
    <View className='flex-1'>
        <CameraView ref={cameraRef} facing={facing} style={{flex: 1, width: '100%'}}  />
      </View>
  )
}

export default visualizerScreen