import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const MoreAttachsLeft = ({length, onPress, contStyle = ""}: {length: number; onPress: () => void; contStyle?: string|null}) => {
    
  return (
    <View className={`${contStyle} animate-pulse`} >
        <TouchableOpacity onPress={onPress} className={`px-4 py-2 bg-indigo-600 mt-2 rounded-xl self-start border-gray-500`}>
            <Text className='text-white font-pregular text-sm'>{length} {length === 1 ? "artikull" : "artikuj"} me shume</Text>
        </TouchableOpacity> 
    </View>
  )
}

export default MoreAttachsLeft