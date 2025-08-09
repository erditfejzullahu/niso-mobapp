import ActiveRoutesFilterComponent from '@/components/ActiveRoutesFilterComponent'
import HeaderComponent from '@/components/HeaderComponent'
import React from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

const ActiveRoutes = () => {
  return (
    <View className='flex-1'>
      <FlatList 
        data={[]}
        className='p-4'
        renderItem={({item}) => (
          <View>

          </View>
        )}
        ListHeaderComponent={() => (
          <>
          <View className='gap-4'>
            <HeaderComponent title='Udhëtime në pritje' subtitle={"Këtu mund të kapni udhëtime në kohë reale. Shfrytëzoni filtrat e mëposhtëm për informacione më të specifikuara."}/>
            <ActiveRoutesFilterComponent />
          </View>
          </>
        )}
      />
    </View>
  )
}

export default ActiveRoutes