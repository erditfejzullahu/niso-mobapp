import HeaderComponent from '@/components/HeaderComponent';
import TextField from '@/components/TextField';
import api from '@/hooks/useApi';
import { createRideSchema } from '@/schemas/createRideSchema';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ArrowUpLeft, ArrowUpRight, Calculator, Euro, HelpCircle, Info, LocationEdit, MapPin, MapPinPlus, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import {z} from "zod"

const CreateTransport = () => {
  const router = useRouter();
  const [priceCalculatorModal, setPriceCalculatorModal] = useState(false)
  const [urgencyInformationModal, setUrgencyInformationModal] = useState(false)
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
          <TouchableOpacity onPress={() => setPriceCalculatorModal(true)} className='absolute top-0 bg-red-600 p-1.5 pb-1 z-50 right-0 rounded-tr-2xl rounded-bl-md self-start'>
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
          <TouchableOpacity onPress={() => setUrgencyInformationModal(true)} className='absolute top-0 bg-red-600 p-1.5 pb-1 z-50 left-0 rounded-tl-2xl rounded-br-md self-start'>
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


      <Modal visible={priceCalculatorModal} animationType="slide" transparent onRequestClose={() => setPriceCalculatorModal(false)}>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <ScrollView showsVerticalScrollIndicator={false} className="bg-white flex-grow-0 max-h-[80%] rounded-xl p-5 w-11/12">
            <View>
              <View className='flex-row items-start shadow-lg shadow-black/15 border border-gray-200 bg-gray-100 p-3 rounded-lg justify-between mb-3'>
                <View className='flex-1'>
                  <Text className="text-lg font-psemibold text-indigo-950">
                    Paketat Niso.
                  </Text>
                <Text className="text-gray-400 text-xs">Ky modal shërben për informacione mbi <Text className='text-gray-600'>"si funksjonon kalkulimi/llogaritja e cmimit te udhetimit".</Text></Text>
                </View>
                <TouchableOpacity onPress={() => setPriceCalculatorModal(false)}>
                  <X color={"#4f46e5"}/>
                </TouchableOpacity>
              </View>
              <Text className='text-indigo-950 text-xs font-pregular'>Aktualisht llogaritja e cmimit te udhetimit ofrohet ne dy(2) opsione: <Text className='text-indigo-600 font-psemibold'>Paguaj per kilometer</Text> dhe <Text className='text-indigo-600 font-psemibold'>Paguaj me cmimin tend - Paguaj me cmimin tend dhe te shoferit</Text>.</Text>

              <View className='my-3 bg-gray-50 shadow-lg shadow-black/15 border border-gray-200 rounded-lg p-3'>
                <Text className='text-indigo-600 font-psemibold text-sm'>Paguaj per kilometer:<Text className='text-xs font-pregular'>(Se shpejti)</Text></Text>
                <Text className='text-indigo-950 text-xs font-pregular'>- Ne baze te distances nga <Text className='text-red-600 font-psemibold'>Pika A</Text> deri tek <Text className='text-red-600 font-psemibold'>Pika B</Text>
                {" "}do kalkulohet cmimi ne baze te kesaj formule: <Text className='text-red-600 font-psemibold'>italic_XXX_XXX_XXX</Text>.
                </Text>
              </View>

              <View className='my-3 bg-gray-50 shadow-lg shadow-black/15 border border-gray-200 rounded-lg p-3'>
                <Text className='text-indigo-600 font-psemibold text-sm'>Paguaj me cmimin tend:</Text>
                <Text className='text-indigo-950 text-xs font-pregular'>- <Text className='text-red-600 font-psemibold'>JU</Text> do paguani ne baze te cmimit te percaktuar nga <Text className='text-red-600 font-psemibold'>JU</Text> per udhetimin nga <Text className='text-red-600 font-psemibold'>Pika A</Text> deri tek <Text className='text-red-600 font-psemibold'>Pika B</Text>.</Text>
              </View>

              <View className='my-3 bg-gray-50 shadow-lg shadow-black/15 border border-gray-200 rounded-lg p-3'>
                <Text className='text-indigo-600 font-psemibold text-sm'>Paguaj me cmimin tend dhe te shoferit:</Text>
                <Text className='text-indigo-950 text-xs font-pregular'>- Zgjerim i opsionit <Text className='text-red-600 font-psemibold'>Paguaj me cmimin tend</Text>. Shoferi ka mundesi per kunder-oferte te cmimit tuaj. Per gjithcka njoftoheni me njoftim nga larte, dhe poashtu mund t'i gjeni te gjitha ofertat tek faqja <Text className='text-red-600 font-psemibold'>Bisedat</Text>.
                {" "}
                </Text>
              </View>

              <View className="flex-row justify-between mt-3">
                <TouchableOpacity onPress={() => { setPriceCalculatorModal(false); router.replace({pathname: "/client/section/client-profile", params: {reason: "initiateHelp"}})}} className='px-4 py-1.5 rounded-lg flex-row items-center gap-1 bg-indigo-600'>
                  <Text className='text-white font-pregular'>Kontakto ndihmen</Text>
                  <HelpCircle color={"white"} size={18}/>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPriceCalculatorModal(false)}
                  className="px-4 py-1.5 rounded-lg flex-row items-center gap-1 bg-red-600"
                >
                  <Text className="text-white font-pregular">Mbyll</Text>
                  <X color={"white"} size={18} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={urgencyInformationModal} animationType="slide" transparent onRequestClose={() => setUrgencyInformationModal(false)}>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <ScrollView showsVerticalScrollIndicator={false} className="bg-white flex-grow-0 max-h-[80%] rounded-xl p-5 w-11/12">
            <View>
              <View className='flex-row items-start shadow-lg shadow-black/15 border border-gray-200 bg-gray-100 p-3 rounded-lg justify-between mb-3'>
                <View className='flex-1'>
                  <Text className="text-lg font-psemibold text-indigo-950">
                    Paketat Urgjente
                  </Text>
                  <Text className="text-gray-400 text-xs">Ky modal shërben për informacione mbi <Text className='text-gray-600'>"paketat Urgjente dhe Te Zakonshme".</Text></Text>
                </View>
                <TouchableOpacity onPress={() => setPriceCalculatorModal(false)}>
                  <X color={"#4f46e5"}/>
                </TouchableOpacity>
              </View>
              <Text className='text-indigo-950 text-xs font-pregular'>Aktualisht ne Niso. udhetimet mund te jene ne dy(2) opsione te natyres se zakonshme dhe te jashtezakonshme: <Text className='text-indigo-600 font-psemibold'>Udhetime Te Zakonshme</Text> dhe <Text className='text-indigo-600 font-psemibold'>Udhetime Urgjente</Text>.</Text>

              <View className='my-3 bg-gray-50 shadow-lg shadow-black/15 border border-gray-200 rounded-lg p-3'>
                <Text className='text-indigo-600 font-psemibold text-sm'>Udhetimi i Zakonshem</Text>
                <Text className='text-indigo-950 text-xs font-pregular'>- Respektohet <Text onPress={() => {setUrgencyInformationModal(false); setPriceCalculatorModal(true)}} className='text-red-600 font-psemibold underline'>Tabela e kalkulimit te Cmimit</Text> plotesisht.</Text>
              </View>

              <View className='my-3 bg-gray-50 shadow-lg shadow-black/15 border border-gray-200 rounded-lg p-3'>
                <Text className='text-indigo-600 font-psemibold text-sm'>Udhetim Urgjent:</Text>
                <Text className='text-indigo-950 text-xs font-pregular'>Ne zgjidhe te udhetimit <Text className='text-red-600 font-psemibold'>Urgjent</Text>
                {" "} ju jeni ne nje perqindje me te larte qe shoferi do mberrij me shpejte tek ju per shkak se:
                </Text>
                <Text className='text-red-600 font-psemibold text-xs'>- Ju paguani <Text className='text-indigo-950'>2€(Euro)</Text> me shume.</Text>
                <Text className='text-red-600 font-psemibold text-xs'>- Shoferi paguhet nga starti <Text className='text-indigo-950'>1.5€(Euro)</Text> me shume.</Text>
                <Text className='text-red-600 font-psemibold text-xs'>- Platforma <Text className='text-indigo-950'>Niso.</Text> merr pjesen tjeter te fitimit.</Text>
              </View>


              <View className="flex-row justify-between mt-3">
                <TouchableOpacity onPress={() => { setUrgencyInformationModal(false); router.replace({pathname: "/client/section/client-profile", params: {reason: "initiateHelp"}})}} className='px-4 py-1.5 rounded-lg flex-row items-center gap-1 bg-indigo-600'>
                  <Text className='text-white font-pregular'>Kontakto ndihmen</Text>
                  <HelpCircle color={"white"} size={18}/>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setUrgencyInformationModal(false)}
                  className="px-4 py-1.5 rounded-lg flex-row items-center gap-1 bg-red-600"
                >
                  <Text className="text-white font-pregular">Mbyll</Text>
                  <X color={"white"} size={18} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

    </KeyboardAwareScrollView>
  );
};

export default CreateTransport;
