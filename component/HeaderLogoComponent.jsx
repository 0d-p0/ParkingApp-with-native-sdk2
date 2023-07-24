import { StyleSheet,Image,PixelRatio } from 'react-native'
import React from 'react'

import logo from '../Resources/Logo/logo.png'
import normalize from 'react-native-normalize'

const HeaderLogoComponent = () => {
  return (
    <Image
    source={logo}
    style={styles.logo}
/>



  )
}

export default HeaderLogoComponent

const styles = StyleSheet.create({
    logo: {
        width: PixelRatio.roundToNearestPixel(150),
        height: PixelRatio.roundToNearestPixel(120),
        resizeMode: 'center',
        alignSelf: 'center'
    },
})