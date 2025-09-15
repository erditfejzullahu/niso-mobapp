import HeaderComponent from '@/components/HeaderComponent';
import TextField from '@/components/TextField';
import api from '@/hooks/useApi';
import { createRideSchema } from '@/schemas/createRideSchema';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ArrowUpLeft, ArrowUpRight, Calculator, Euro, Info, LocationEdit, MapPin, MapPinPlus } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import {z} from "zod"

const CreateTransport = () => {

  const driversActive = useSharedValue(1);

  const {control, reset, formState: {errors, isSubmitting}, handleSubmit} = useForm<z.infer<typeof createRideSchema>>({
    resolver: zodResolver(createRideSchema),
    defaultValues: useMemo(() => ({
      isUrgent: false,
      price: 0.50,
      fromAddress: "",
      toAddress: ""
    }), []),
    mode: "onChange"
  })

  const submitRideRequest = useCallback(async (data: z.infer<typeof createRideSchema>) => {
    try {
      const res = await api.post('/rides/passenger-create-riderequest', data);
      if(res.data.success){
        Toast.show({
          type: "success",
          text1: "Sukses!",
          text2: "Sapo keni krijuar nje kerkese per udhetim. Shikoni detajet ne balline."
        })
        reset();
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Gabim",
        text2: error.response.data.message || "Dicka shkoi gabim ne server. Ju lutem provoni perseri."
      })
    }
  }, [reset])
  
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
    player.muted = true;
    player.play();
    player.loop = true;
  });

  useEffect(() => {
    if(player){
      player.muted = true;
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

      {/* gjithqysh me implementu qita TODO: */}
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
      {/* gjithqysh me implementu qita TODO: */}

      <View className='w-full gap-3 mt-3'>
        <View className='flex-1 relative shadow-md bg-white p-3 rounded-2xl shadow-black/10'>
          <TouchableOpacity className='absolute top-0 bg-red-600 p-1.5 pb-1 z-50 right-0 rounded-tr-2xl rounded-bl-md self-start'>
            <LocationEdit color={"#fff"} size={20}/>
          </TouchableOpacity>
          <Controller 
            control={control}
            name="fromAddress"
            render={({field}) => (
              <>
                <TextField 
                  titleImage={<><MapPin color={"#4f46e5"} size={16}/></>}
                  title='Adresa e nisjes'
                  placeholder='Shkruani ketu adresen e nisjes...'
                  {...field}
                  onChangeText={(e) => field.onChange(e)}
                />
                <Text className='text-[8px] font-plight text-gray-500 mt-1'>Ketu mund te paraqisesh adresen e sakte se ku do e presesh shoferin. Shfrytezoni harten ne rast se hasni ne probleme emerimi. <ArrowUpRight color={"#000"} size={10} /></Text>
              </>
            )}
          />
          {errors.fromAddress && (
            <Text className='text-xs font-plight text-red-500 mt-1'>{errors.fromAddress.message}</Text>
          )}
        </View>

        <View className='flex-1 relative shadow-md bg-white p-3 rounded-2xl shadow-black/10'>
          <TouchableOpacity className='absolute top-0 bg-red-600 p-1.5 pb-1 z-50 left-0 rounded-tl-2xl rounded-br-md self-start'>
            <LocationEdit color={"#fff"} size={20}/>
          </TouchableOpacity>
          <Controller 
            control={control}
            name="toAddress"
            render={({field}) => (
              <>
                <TextField 
                  titleImageStyle={"justify-end"}
                  className='text-right'
                  titleImage={<><MapPin color={"#4f46e5"} size={16}/></>}
                  title='Adresa e mberritjes'
                  placeholder='Shkruani ketu piken destinuese...'
                  {...field}
                  onChangeText={(e) => field.onChange(e)}
                />
                <Text className='text-[8px] font-plight text-gray-500 mt-1 text-right'>Ketu mund te paraqisesh adresen e sakte se ku do eshte pika juaj mberritese-perfundimtare. Shfrytezoni harten ne rast se hasni ne probleme emerimi. <ArrowUpLeft color={"#000"} size={10} /></Text>
              </>
            )}
          />
          {errors.toAddress && (
            <Text className='text-xs font-plight text-red-500 mt-1'>{errors.toAddress.message}</Text>
          )}
        </View>

        <View className='flex-1 relative shadow-md bg-white p-3 rounded-2xl shadow-black/10'>
          <TouchableOpacity className='absolute top-0 bg-red-600 p-1.5 pb-1 z-50 right-0 rounded-tr-2xl rounded-bl-md self-start'>
            <Calculator color={"#fff"} size={20}/>
          </TouchableOpacity>
          <Controller 
            control={control}
            name="price"
            render={({field}) => (
              <>
                <TextField 
                  titleImage={<><Euro color={"#4f46e5"} size={16}/></>}
                  title='Cmimi i udhetimit'
                  placeholder='Shkruani ketu cmimin tuaj te udhetimit...'
                  value={field.value.toString()}
                  onChangeText={(e) => {
                    const toNumber = parseInt(e)
                    field.onChange(toNumber)
                  }}
                  keyboardType="numeric"
                />
                <Text className='text-[8px] font-plight text-gray-500 mt-1'>Paraqitni shumen me te cilen deshiron qe shoferi te ju dergoj ne destinacionin e caktuar. Shuma minimale eshte <Text className='text-red-600 font-psemibold'>0.50€</Text> dhe shuma maksimale eshte <Text className='text-red-600 font-psemibold'>200€</Text>. Shikoni tabelen e kalkulimeve. <ArrowUpRight color={"#000"} size={10} /></Text>
              </>
            )}
          />
          {errors.price && (
            <Text className='text-xs font-plight text-red-500 mt-1'>{errors.price.message}</Text>
          )}
        </View>

        <View className='flex-1 relative shadow-md bg-white p-3 rounded-2xl shadow-black/10'>
          <TouchableOpacity className='absolute top-0 bg-red-600 p-1.5 pb-1 z-50 left-0 rounded-tl-2xl rounded-br-md self-start'>
            <Info color={"#fff"} size={20}/>
          </TouchableOpacity>
          <Controller 
            control={control}
            name="isUrgent"
            render={({field}) => (
              <>
                <View className='flex-row mb-1 justify-end gap-1'>
                  <FontAwesome5 name="running" size={16} color="#4f46e5" />
                  <Text className="text-gray-700 text-right font-pmedium text-sm">Lloji i udhetimit</Text>
                </View>
                <SegmentedControl
                  values={['I zakonshem', 'Urgjent']}
                  selectedIndex={field.value === false ? 0 : 1}
                  onChange={(event) => {event.nativeEvent.selectedSegmentIndex === 0 ? field.onChange(false) : field.onChange(true)}}
                />
                <Text className='text-[8px] font-plight text-gray-500 mt-1 text-right'>Beni zgjedhjen ne mes udhetimit <Text className='text-red-600 font-psemibold'>Urgjent</Text> dhe udhetimit te <Text className='text-red-600 font-psemibold'>Zakonshem</Text>. Informacionet per secilin udhetim mund ti gjeni me larte. <ArrowUpLeft color={"#000"} size={10} /></Text>
              </>  
            )}
          />
        </View>

        <TouchableOpacity className='bg-red-600 rounded-2xl gap-2 justify-center flex-row px-4 py-3 items-center'>
            <FontAwesome6 name="map-location-dot" size={24} color="white" />
            <Text className='text-white font-psemibold'>Shikoni udhetimet aktive</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={isSubmitting} onPress={handleSubmit(submitRideRequest)} className={`bg-indigo-600 rounded-2xl gap-2 justify-center flex-row px-4 py-3 items-center ${isSubmitting && "opacity-50"}`}>
            <Text className='text-white font-psemibold'>{isSubmitting ? "Duke shtuar kerkesen..." : "Shtoni kerkese per udhetim"}</Text>
            <MapPinPlus color={"white"} size={24}/>
        </TouchableOpacity>

        <View className='h-[80px]'/>

      </View>

    </KeyboardAwareScrollView>
  );
};

export default CreateTransport;
