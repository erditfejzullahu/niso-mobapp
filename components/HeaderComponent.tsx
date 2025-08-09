import React, { memo } from 'react';
import { Image, Text, View } from 'react-native';

const HeaderComponent = ({title, subtitle}: {title: string; subtitle?: string | null}) => {
  return (
    <View className='bg-white p-3 rounded-xl shadow-lg shadow-black/5'>
        {subtitle && <Text className='text-[10px] font-pmedium text-gray-400'>{subtitle}</Text>}
        <View className='relative pb-2'>
            <View>
                <Text className='text-3xl font-psemibold relative text-indigo-950'>{title}</Text>
            </View>
            <View className='absolute left-0 -bottom-[13px] w-full'>
                <Image 
                    source={require('../assets/images/path.png')}
                    style={{tintColor: "#4338ca"}}
                    className='w-[100px]'
                    resizeMode="contain"
                />
            </View>
        </View>
    </View>
  )
}

export default memo(HeaderComponent)