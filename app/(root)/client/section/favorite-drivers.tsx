import ActiveDrivers from '@/components/client/ActiveDrivers'
import HeaderComponent from '@/components/HeaderComponent'
import dayjs from "dayjs"
import { CirclePlus, UserStar } from 'lucide-react-native'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const FavoriteDrivers = () => {
    const dummyActiveDrivers = [
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

    const [favoriteDrivers, setFavoriteDrivers] = useState<'favorites' | 'add'>('favorites')
    
  return (
    <KeyboardAwareScrollView className='p-4 bg-gray-50'>
        <HeaderComponent title={'Shoferët e preferuar'} subtitle={"Në këtë seksion mund të ndërveproni me shoferët tuaj të preferuar apo mund të shtoni shofer tjetër të preferuar"}/>
        <View className='flex-row flex-1 rounded-xl bg-white shadow-md shadow-black/5 mt-3'>
            <TouchableOpacity className='flex-1 border-r border-gray-300 flex-row items-center justify-center my-2 gap-1' onPress={() => setFavoriteDrivers("favorites")}>
                <Text className={`font-plight text-sm ${favoriteDrivers === "favorites" && 'text-indigo-600 !font-pmedium'}`}>Të preferuar</Text>
                <UserStar color={favoriteDrivers === "favorites" ? "#4f46e5" : "#1e1b4b"} size={16}/>
            </TouchableOpacity>
            <TouchableOpacity className='flex-1 flex-row items-center justify-center gap-1 my-2' onPress={() => setFavoriteDrivers("add")}>
                <Text className={`font-plight text-sm ${favoriteDrivers === "add" && 'text-indigo-600 !font-pmedium'}`}>Shtoni</Text>
                <CirclePlus color={favoriteDrivers === 'add' ? "#4f46e5" : "#1e1b4b"} size={16}/>
            </TouchableOpacity>
        </View>
        {favoriteDrivers === 'favorites' ? (
            <View className='gap-3 mt-3'>
                {dummyActiveDrivers.map((item) => (
                    <ActiveDrivers driverActive={item} key={item.id}/>
                ))}
            </View>
        ) : (
            <View>

            </View>
        )}
    </KeyboardAwareScrollView>
  )
}

export default FavoriteDrivers