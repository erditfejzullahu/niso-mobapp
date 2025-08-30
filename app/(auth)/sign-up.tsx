import { useAuth } from '@/context/AuthContext';
import { registerSchema } from '@/schemas/registerSchema';
import AntDesign from '@expo/vector-icons/AntDesign';
import { zodResolver } from '@hookform/resolvers/zod';
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dimensions, Image, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import {z} from "zod"

const { width, height } = Dimensions.get('window');

const NisoSignUp = () => {
  const {signUp} = useAuth();

  const [accountType, setAccountType] = useState(0) //0 for CLIENT, 1 for DRIVER

  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [imageSelected, setImageSelected] = useState("")

  const scrollY = useSharedValue(0);
  const titleColor = useSharedValue(0);
  const dotScale = useSharedValue(1);

  // Pulse animation for dot
  useEffect(() => {
    dotScale.value = withRepeat(
      withTiming(1.3, {
        duration: 500,
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    );
  }, []);

  // Title animation
  useEffect(() => {
    titleColor.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1,
      true
    );
  }, []);

  const animatedDotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }]
  }));

  const backgroundLayer = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(
        scrollY.value,
        [0, height * 0.5],
        [0, -100],
        Extrapolation.CLAMP
      )
    }],
    opacity: interpolate(
      scrollY.value,
      [0, height * 0.3],
      [1, 0.85],
      Extrapolation.CLAMP
    )
  }));

  const animatedTitleStyle = useAnimatedStyle(() => {
    const hue = interpolate(titleColor.value, [0, 1], [0, 360], Extrapolation.CLAMP);
    return {
      color: `#4f46e5`,
      transform: [{ scale: withSpring(1 + Math.sin(titleColor.value * Math.PI) * 0.05) }]
    };
  });

  const handleScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  const handleImageUpload = async () => {
    const {status} = await ImagePicker.getMediaLibraryPermissionsAsync()
    
    if(status !== "granted" && status !== "undetermined"){
      Toast.show({
        type: "error",
        text1: "Ju duhet të jepni leje për të hapur galerinë"
      })
      return;
    }

    const imagePicked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.7,
      aspect: [1,1],
      allowsEditing: true
    })

    if(!imagePicked.canceled){
      const imageUri = imagePicked.assets[0].uri
      setImageSelected(imageUri)

      // try {
      //   const imageContext = ImageManipulator.ImageManipulator.manipulate(imageUri)
      //   const image = await imageContext.renderAsync();
      //   const result = await image.saveAsync({
      //     compress: 0.7,
      //     format: ImageManipulator.SaveFormat.WEBP
      //   })
      //   setImageToSend(result.uri)
      // } catch (error) {
      //   console.error("error converting image ", error);
      //   setImageToSend(null)
      // }
    }
    // setImageToSend(null)
  }

  const {control, handleSubmit, formState: {errors, isSubmitting}} = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      password: "",
      email: "",
      confirmPassword:""
    }
  })

  const handleSignUp = async (data: z.infer<typeof registerSchema>) => {
    let valid = true;
    // Check password strength

    // Check password match
    if (data.password !== data.confirmPassword) {
      setConfirmPasswordError('Fjalëkalimi dhe konfirmimi i fjalekalimit nuk përputhen.');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if((accountType > 1) || (accountType < 0)){
      Toast.show({
        type: "error",
        text1: "Gabim!",
        text2: "Ju lutem zgjidhni mes tipeve egzistuese te llogarise sic jane: SHOFERI dhe PASAGJERI."
      })
      valid = false;
    }

    if(!imageSelected){
      Toast.show({
        type: "error",
        text1: "Gabim!",
        text2: "Ju lutem paraqisni foton tuaj te profilit."
      })
      valid = false;
    }

    if (!valid) return;

    try {
      await signUp(data.fullName, data.email, data.password, data.confirmPassword, accountType, imageSelected)
      Toast.show({
        type: "success",
        text1: "Sapo u regjistruat me sukses në Niso. Tani do te ridrejtoheni tek seksioni i verifikimit te identitetit tuaj."
      })
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Dicka shkoi gabim në regjistrimin tuaj"
      })
    }
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Parallax Background */}
      <Animated.View className="absolute w-full h-96" style={backgroundLayer}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1350&q=80' }}
          className="flex-1"
          blurRadius={2}
        >
          <View className="absolute inset-0 bg-black/85 opacity-80" />
        </ImageBackground>
      </Animated.View>

      {/* Content */}
      <KeyboardAwareScrollView className="flex-1" onScroll={handleScroll} scrollEventThrottle={16}>
        <View className="h-64" />

        <View className="bg-white mx-6 rounded-3xl p-8 shadow-md shadow-black/15 border border-gray-100">
          {/* Title */}
          <View className="items-center mb-10">
            <Animated.Text className="text-4xl font-pbold mb-1 pt-3" style={animatedTitleStyle}>
              Regjistrohu<Animated.Text style={animatedDotStyle} className="text-black text-6xl">.</Animated.Text>
            </Animated.Text>
            <Text className="text-gray-600 text-center font-pregular">
              Krijoni një llogari për të lëvizur shpejt me Niso.
            </Text>
          </View>

          <View className='mb-6'>
            <Text className='text-gray-700 font-pmedium mb-1 text-center'>Fotoja juaj</Text>
            <TouchableOpacity onPress={handleImageUpload} className='rounded-full border-indigo-600 border-2 self-start mx-auto overflow-hidden'>
              <Image 
                source={{uri: imageSelected || "https://avatar.iran.liara.run/public"}}
                style={{width: 74, height: 74}}
                resizeMode='cover'
              />
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <View className="mb-6 border-b border-gray-200">
            <Controller 
              control={control}
              name="fullName"
              render={({field}) => (
                <>
                  <Text className="text-gray-700 mb-1 font-pmedium">Emri i plotë</Text>
                  <TextInput
                    className="text-gray-800 h-[35px]"
                    placeholder="John Doe"
                    placeholderTextColor="#9CA3AF"
                    {...field}
                  />
                  </>
                )}
              />
            {errors.fullName && (
              <Text className='text-xs font-plight text-red-500 mt-1'>{errors.fullName.message}</Text>
            )}
          </View>

          {/* Email */}
          <View className="mb-6 border-b border-gray-200">
            <Controller 
              control={control}
              name="email"
              render={({field}) => (
                <>
                <Text className="text-gray-700 mb-1 font-pmedium">Email</Text>
                <TextInput
                  className="text-gray-800 h-[35px]"
                  placeholder="perdoruesi@shembull.com"
                  placeholderTextColor="#9CA3AF"
                  {...field}
                />
                </>
              )}
            />
            {errors.email && (
              <Text className='text-xs font-plight text-red-500 mt-1'>{errors.email.message}</Text>
            )}
          </View>

          {/* role */}
          <View className='mb-6 border-gray-200'>
            <Text className='text-gray-700 mb-1 font-pmedium'>Lloji i llogarise</Text>
            <SegmentedControl 
                values={['Pasagjer', 'Shofer']}
                selectedIndex={accountType}
                onChange={(event) => {setAccountType(event.nativeEvent.selectedSegmentIndex)}}
            />
          </View>

          {/* Password */}
          <View className={`border-b border-gray-200`}>
            <Controller 
              control={control}
              name="password"
              render={({field}) => (
                <>
                <Text className="text-gray-700 mb-1 font-pmedium">Fjalëkalimi</Text>
                <TextInput
                  className="text-gray-800 h-[35px]"
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  {...field}
                  secureTextEntry
                />
                </>
              )}
            />

          </View>

          {/* Confirm Password */}
          <View className={`border-b ${!confirmPasswordError && "mb-8"} border-gray-200`}>
            <Controller 
              control={control}
              name="confirmPassword"
              render={({field}) => (
                <>
                <Text className="text-gray-700 mb-1 font-pmedium">Konfirmo fjalëkalimin</Text>
                <TextInput
                  className="text-gray-800 h-[35px]"
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  {...field}
                />
                </>
              )}
            />
            {confirmPasswordError ? <Text className="text-red-500 mb-8 text-sm mt-1">{confirmPasswordError}</Text> : null}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity disabled={isSubmitting} onPress={handleSubmit(handleSignUp)} className={`bg-black rounded-full p-4 items-center mt-4 ${isSubmitting && "opacity-50"}`} activeOpacity={0.9}>
            <Text className="text-white font-pbold text-lg">Krijo Llogari</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6 mb-5">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-500 font-pregular pb-1">ose</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Social Buttons */}
          <View className="flex-row justify-center gap-2">
            <TouchableOpacity className="border border-gray-200 rounded-full p-3 flex-row items-center gap-2">
              <Text className="text-gray-800 font-pregular">Google</Text>
              <AntDesign name="google" size={24} color="#4f46e5" />
            </TouchableOpacity>
            <TouchableOpacity className="border border-gray-200 rounded-full p-3 flex-row items-center gap-2">
              <Text className="text-gray-800 font-pregular">Apple</Text>
              <AntDesign name="apple1" size={24} color="#4f46e5" />
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View className="mt-8 items-center">
            <Text className="text-gray-600 font-pregular">Keni tashmë një llogari? </Text>
              <Link href={'/(auth)/sign-in'}>
                  <Text className="text-black font-psemibold">Kyçuni</Text>
              </Link>
          </View>
        </View>

        <View className="h-20" />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default NisoSignUp;
