import ActiveTransports from '@/components/client/ActiveTransports'
import HeaderComponent from '@/components/HeaderComponent'
import { Plus } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

const ClientHome = () => {
  return (
    <KeyboardAwareFlatList 
      className='bg-gray-50 p-4'
      data={[]}
      renderItem={() => (
        <View>
          <Text>asd</Text>
        </View>
      )}
      ListHeaderComponent={() => (
        <View className='gap-3'>
          <HeaderComponent 
            title={<>Mirësevini, <Text className='text-indigo-600'>Erdit Fejzullahu</Text></>} textStyle={"!font-pmedium !text-2xl"}
            subtitle={"Këtu mund të ndërveproni me veçoritë kyçe të Niso."} imageStyle={"!-bottom-[15px]"}
          />
          <TouchableOpacity className='bg-indigo-600 gap-2 flex-row py-2 items-center justify-center rounded-xl'>
            <Text className='font-pmedium text-white'>Kërkoni transport</Text>
            <Plus color={"white"}/>
          </TouchableOpacity>
          <ActiveTransports />
        </View>
      )}
    />
  )
}

export default ClientHome