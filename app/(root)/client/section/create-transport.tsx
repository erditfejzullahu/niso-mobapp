import HeaderComponent from '@/components/HeaderComponent';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const CreateTransport = () => {

  const driversActive = useSharedValue(1);
  
  React.useEffect(() => {
    driversActive.value = withRepeat(
      withTiming(1.2, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    )
  }, [])

  const driversActiveStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: driversActive.value}]
    }
  })

  const videoSource = require('../../../../assets/videos/driver.mp4');

  const player = useVideoPlayer(videoSource, player => {
    player.play();
    player.loop = true;
  });

  useEffect(() => {
    if(player){
      player.play();
      player.loop = true;
    }
  }, [player])
  
  

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       if(player){
  //         player.pause();
  //         player.release();
  //       }
  //     };
  //   }, [player])
  // );

  return (
    <KeyboardAwareScrollView className="bg-gray-50 p-4">
      <HeaderComponent 
        title="Kërko transport"
        subtitle="Duke plotësuar fushat e mëposhtme ju mund të kërkoni transportin më të shpejtë dhe më të lirë ne vend!"
      />
      <View className='w-full rounded-xl shadow-md shadow-black/10 mt-3'>
        <View className='flex-row items-center self-start overflow-hidden mx-auto justify-center gap-1 bg-white shadow-md shadow-black/10 rounded-xl'>
          <VideoView 
            player={player} 
            style={{ width: 36, height: 36 }} 
          />
          
          {/* ✅ Animated.Text wrapping the number */}
          <Animated.Text style={driversActiveStyle} className="font-pbold text-indigo-600 text-sm">
            10
          </Animated.Text>
          <Animated.Text className="font-psemibold text-sm text-indigo-950">
            {' '}shofer aktiv afër jush!
          </Animated.Text>
          <VideoView 
            player={player} 
            style={{ width: 36, height: 36 }} 
          />
        </View>
      </View>

      

    </KeyboardAwareScrollView>
  );
};

export default CreateTransport;
