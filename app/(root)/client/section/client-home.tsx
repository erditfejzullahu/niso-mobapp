import ActiveTransport from '@/components/client/ActiveTransport'
import HeaderComponent from '@/components/HeaderComponent'
import { Plus } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Animated, { Easing, FadeInLeft } from 'react-native-reanimated'

import ActiveRidesCount from '@/components/ActiveRidesCount'
import HomeActiveDriversWrapper from '@/components/client/HomeActiveDriversWrapper'
import dayjs from "dayjs"
import { router } from 'expo-router'



export const dummyActiveDrivers = [
  {
    id: 1,
    name: "Ardit Leka",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4.7,
    car: {
      brand: "Mercedes",
      model: "E-Class",
      plate: "TR-456-AB",
    },
    registeredAt: dayjs().subtract(8, "month").toISOString(),
    onDuty: true,
  },
  {
    id: 2,
    name: "Eriona Krasniqi",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    car: {
      brand: "BMW",
      model: "X5",
      plate: "AA-789-CC",
    },
    registeredAt: dayjs().subtract(1, "year").toISOString(),
    onDuty: true,
  },
  {
    id: 3,
    name: "Blerim Dervishi",
    photo: "https://randomuser.me/api/portraits/men/53.jpg",
    rating: 4.3,
    car: {
      brand: "Audi",
      model: "A4",
      plate: "DR-654-DF",
    },
    registeredAt: dayjs().subtract(2, "year").toISOString(),
    onDuty: false,
  },
];


const ClientHome = () => {
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
      <View className='gap-3'>
        <HeaderComponent 
          title={<>Mirësevini, <Text className='text-indigo-600'>Erdit Fejzullahu</Text></>} textStyle={"!font-pmedium !text-2xl"}
          subtitle={"Këtu mund të ndërveproni me veçoritë kyçe të Niso."} imageStyle={"!-bottom-[15px]"}
        />
        <Animated.View entering={FadeInLeft.easing(Easing.bounce).duration(1000)}>
          <TouchableOpacity onPress={() => router.push('/(root)/client/section/create-transport')} className='bg-indigo-600 gap-2 flex-row py-2 items-center justify-center rounded-xl'>
            <Text className='font-pmedium text-white'>Kërkoni transport</Text>
            <Plus color={"white"}/>
          </TouchableOpacity>
        </Animated.View>
        <ActiveTransport />
        <ActiveRidesCount count={17}/>

        <HomeActiveDriversWrapper activeDrivers={dummyActiveDrivers}/>
      </View>
    </KeyboardAwareScrollView>
  )
}

export default ClientHome