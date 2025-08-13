import ActiveDrivers from '@/components/client/ActiveDrivers'
import ActiveTransports from '@/components/client/ActiveTransports'
import HeaderComponent from '@/components/HeaderComponent'
import { ArrowUpRight, Plus } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import Animated, { Easing, FadeInLeft, FadeInRight } from 'react-native-reanimated'

import dayjs from "dayjs"

type ActiveDriverProps = {
  id: number;
  name: string;
  photo: string;
  rating: number;
  car: { brand: string; model: string; plate: string };
  registeredAt: string;
  onDuty: boolean;
};

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
    <KeyboardAwareFlatList 
      contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
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
          <Animated.View entering={FadeInLeft.easing(Easing.bounce).duration(1000)}>
            <TouchableOpacity className='bg-indigo-600 gap-2 flex-row py-2 items-center justify-center rounded-xl'>
              <Text className='font-pmedium text-white'>Kërkoni transport</Text>
              <Plus color={"white"}/>
            </TouchableOpacity>
          </Animated.View>
          <ActiveTransports />

          <Animated.View entering={FadeInRight.easing(Easing.bounce).duration(1000)} className='bg-white rounded-2xl shadow-lg shadow-black/10 p-4 gap-3 relative'>
            <View className='bg-indigo-600 absolute top-4 -left-6 -rotate-[35deg] z-50 py-1.5 px-2 rounded-2xl gap-1'>
              <Text className='text-white font-pregular text-sm'>Shoferët aktiv</Text>
            </View>
            <View className='flex-row gap-0 items-center justify-end'>
              <Text className='text-indigo-600 font-pregular text-sm'>Shiko të gjithë shoferët</Text>
              <ArrowUpRight color={"#4f46e5"}/>
            </View>
            {dummyActiveDrivers.map((item) => (
              <ActiveDrivers key={item.id} driverActive={item}/>
            ))}
          </Animated.View>

        </View>
      )}
    />
  )
}

export default ClientHome