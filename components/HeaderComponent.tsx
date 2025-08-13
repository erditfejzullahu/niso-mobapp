import { MapPin } from 'lucide-react-native';
import React, { memo } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, { Easing, FadeInRight } from 'react-native-reanimated';

const HeaderComponent = ({title, subtitle, style, textStyle, imageStyle}: {title: any; subtitle?: string | null, style?: string | null, textStyle?: string | null, imageStyle?: string | null}) => {
  return (
    <Animated.View entering={FadeInRight.easing(Easing.bounce).duration(1000)} className={`bg-white p-3 rounded-xl shadow-lg shadow-black/5 ${style}`}>
        {subtitle && (
        <View className="flex-row items-center mb-1">
          <MapPin size={12} color="#6366F1" style={{ marginRight: 4 }} />
          <Text className="text-[10px] font-pmedium text-gray-500 pr-3">
            {subtitle}
          </Text>
        </View>
      )}
        <View className='relative pb-2'>
            <View>
                <Text className={`text-3xl font-psemibold relative text-indigo-950 ${textStyle}`}>{title}</Text>
            </View>
            <View className={`absolute left-0 -bottom-[13px] w-full ${imageStyle}`}>
                <Image 
                    source={require('../assets/images/path.png')}
                    style={{tintColor: "#4f46e5"}}
                    className='w-[100px]'
                    resizeMode="contain"
                />
            </View>
        </View>
    </Animated.View>
  )
}

export default memo(HeaderComponent)