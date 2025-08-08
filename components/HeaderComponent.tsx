import React from 'react';
import { Image, Text, View } from 'react-native';

const HeaderComponent = ({title, subtitle}: {title: string; subtitle?: string | null}) => {
  return (
    <View className='my-2'>
        {subtitle && <Text className='text-[8px] font-pmedium text-gray-400'>{subtitle}</Text>}
        <View className='relative'>
            <View>
                <Text className='text-3xl font-psemibold relative'>{title}</Text>
            </View>
            <View className='absolute left-0 -bottom-6 w-full'>
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

export default HeaderComponent