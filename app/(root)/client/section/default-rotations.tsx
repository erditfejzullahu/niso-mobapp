import ClientRotationCard from '@/components/client/ClientRotationCard'
import HeaderComponent from '@/components/HeaderComponent'
import { router } from 'expo-router'
import { Plus } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

const DefaultRotations = () => { //psh rotacion tperditshem prej pune shpi prej shpije pun
  const rotations = [
    {
      id: '1',
      fromAddress: 'Shtëpia, Prishtinë',
      toAddress: 'Puna, Fushë Kosovë',
      days: ['E Hënë', 'E Mërkurë', 'E Premte'],
      time: '08:00',
    },
    {
      id: '2',
      fromAddress: 'Shtëpia, Prishtinë',
      toAddress: 'Fitness, Veternik',
      days: ['E Martë', 'E Enjte'],
      time: '18:30',
    },
    {
      id: '3',
      fromAddress: 'Qendra e qytetit, Prishtinë',
      toAddress: 'Shkolla, Lagjja Dardani',
      days: ['E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte'],
      time: null, // nuk ka orar fiks
    },
  ]

  return (
    <KeyboardAwareFlatList 
      className='bg-gray-50'
      contentContainerStyle={{ padding: 16, paddingBottom: 80, gap: 16 }}
      data={rotations}
      renderItem={({item}) => (
        <ClientRotationCard fromAddress={item.fromAddress} toAddress={item.toAddress} days={item.days} time={item.time}/>
      )}
      ListHeaderComponent={() => (
        <View className='gap-3'>
          <HeaderComponent title={"Rotacionet tua"} subtitle={"Nga ky seksion ju mund të krijoni rotacione ditore nga një destinacion tek një destinacion tjetër. P.sh. nga puna në banesë"}/>
          <TouchableOpacity onPress={() => router.push('/client/section/create-rotation')} className='py-3 bg-indigo-600 rounded-xl items-center justify-center flex-row gap-1'>
            <Text className="font-pmedium text-white">Shtoni rotacion</Text>
            <Plus color={"#fff"} size={18}/>
          </TouchableOpacity>
        </View>
      )}
    />
  )
}

export default DefaultRotations