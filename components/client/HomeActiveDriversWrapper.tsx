import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ArrowUpRight } from 'lucide-react-native'
import React, { memo, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, { BounceIn, BounceOut, Easing, FadeInRight } from 'react-native-reanimated'
import ActiveDrivers from './ActiveDrivers'
import { PassengerSectionDrivers } from '@/types/app-types'
import EmptyState from '../system/EmptyState'

const HomeActiveDriversWrapper = ({activeDrivers, onRetry}: {activeDrivers: PassengerSectionDrivers[], onRetry: () => void}) => {
    const router = useRouter();
    const [showDrivers, setShowDrivers] = useState(true)
  return (
    <View className={`relative ${!showDrivers && "py-4"}`}>
        {!showDrivers && <Animated.View className={`absolute top-0 ${!showDrivers && "right-0"} z-50`} entering={BounceIn} exiting={BounceOut}>
            <TouchableOpacity onPress={() => setShowDrivers(!showDrivers)} className='rounded-xl shadow-lg shadow-black/15 bg-white p-1'>
                <MaterialCommunityIcons name="image-filter-vintage" size={24} color="black" />
            </TouchableOpacity>
        </Animated.View>}
        {showDrivers && <Animated.View className={`absolute top-0 ${showDrivers && "left-0"} z-50`} entering={BounceIn} exiting={BounceOut}>
            <TouchableOpacity onPress={() => setShowDrivers(!showDrivers)} className='rounded-xl shadow-lg shadow-black/15 bg-white p-1'>
                <MaterialCommunityIcons name="image-filter-vintage" size={24} color="black" />
            </TouchableOpacity>
        </Animated.View>}

        {showDrivers && <Animated.View entering={FadeInRight.easing(Easing.bounce).duration(1000)} className='bg-white rounded-2xl shadow-lg shadow-black/10 p-4 gap-3 relative'>
            <View className='bg-indigo-600 absolute top-6 -left-4 -rotate-[35deg] z-50 py-1.5 px-2 rounded-2xl gap-1'>
                <Text className='text-white font-pregular text-sm'>Shoferët aktiv</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/client/section/niso-drivers')} className='flex-row gap-0 items-center justify-end'>
                <Text className='text-indigo-600 font-pregular text-sm'>Shiko të gjithë shoferët</Text>
                <ArrowUpRight color={"#4f46e5"}/>
            </TouchableOpacity>
            {activeDrivers.length === 0 ? (
                <EmptyState containerStyle='!bg-white' onRetry={onRetry} message='Nuk u gjeten shofere te Niso. Nese mendoni qe eshte gabim, ju lutem provoni perseri.' textStyle='!font-plight !text-sm'/>
            ) : (
                activeDrivers.map((item) => (
                    <ActiveDrivers key={item.id} driverActive={item}/>
                ))
            )}
            <TouchableOpacity onPress={() => router.push('/client/section/niso-drivers')} className='bg-indigo-600 shadow-lg shadow-black/20 flex-row gap-1 rounded-2xl py-3 items-center justify-center'>
                <Text className='text-white font-pregular'>Më shumë</Text>
                <ArrowUpRight color={"white"} size={18}/>
            </TouchableOpacity>
        </Animated.View>}
    </View>
  )
}

export default memo(HomeActiveDriversWrapper)