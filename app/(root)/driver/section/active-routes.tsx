import ActiveRoutesFilterComponent from '@/components/ActiveRoutesFilterComponent'
import HeaderComponent from '@/components/HeaderComponent'
import React from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

const ActiveRoutes = () => {
  return (
    <View className='flex-1 bg-white mt-2 shadow-lg shadow-black/15 m-2 rounded-[20px]'>
      <FlatList 
        data={[]}
        className='p-4'
        renderItem={({item}) => (
          <View>

          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <HeaderComponent title='Udhëtime në pritje' subtitle={"Këtu mund të kapni udhëtime në kohë reale. Shfrytëzoni filtrat e mëposhtëm për informacione më të specifikuara."}/>
            <ActiveRoutesFilterComponent />
          </>
        )}
      />
    </View>
  )
}

export default ActiveRoutes