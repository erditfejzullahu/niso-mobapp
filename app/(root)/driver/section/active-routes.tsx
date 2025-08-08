import HeaderComponent from '@/components/HeaderComponent'
import React from 'react'
import { View } from 'react-native'

const ActiveRoutes = () => {
  return (
    <View className='p-4'>
      <HeaderComponent title='Udhëtime në pritje' subtitle={"Këtu mund të kapni udhëtime në kohë reale. Shfrytëzoni filtrat e mëposhtëm për informacione më të specifikuara."}/>
    </View>
  )
}

export default ActiveRoutes