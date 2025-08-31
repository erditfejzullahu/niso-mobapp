import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const _layout = () => {
  return (
    <>
    <Stack screenOptions={{headerShown: false}}/>
    <StatusBar style="light"/>
    
    </>
  )
}

export default _layout