import { useAuth } from '@/context/AuthContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

const validatePassword = (pwd: string) => {
  const minLength = /.{8,}/;
  const uppercase = /[A-Z]/;
  const lowercase = /[a-z]/;
  const number = /[0-9]/;
  const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

  return (
    minLength.test(pwd) &&
    uppercase.test(pwd) &&
    lowercase.test(pwd) &&
    number.test(pwd) &&
    specialChar.test(pwd)
  );
};

const { width, height } = Dimensions.get('window');

const NisoSignUp = () => {
  const {signUp} = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState(0) //0 for CLIENT, 1 for DRIVER

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false)

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

  const handleSignUp = async () => {
    let valid = true;
    // Check password strength
    if (!validatePassword(password)) {
      setPasswordError('Fjalëkalimi duhet të ketë të paktën 8 karaktere, një shkronjë të madhe, një të vogël, një numër dhe një karakter special.');
      valid = false;
    } else {
      setPasswordError('');
    }

    // Check password match
    if (password !== confirmPassword) {
      setConfirmPasswordError('Fjalëkalimi dhe konfirmimi nuk përputhen.');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if(imageSelected === null){
      Toast.show({
        type: "error",
        text1: "Ju lutem fusni nje foto profili."
      })
      valid = false;
    }

    if (!valid) return;
    setLoading(true)

    try {
      await signUp(fullName, email, password, confirmPassword, accountType, imageSelected)
      Toast.show({
        type: "success",
        text1: "Sapo u regjistruat me sukses në Niso."
      })
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Dicka shkoi gabim në regjistrimin tuaj"
      })
    }

    setLoading(false)
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
            <Text className="text-gray-700 mb-1 font-pmedium">Emri i plotë</Text>
            <TextInput
              className="text-gray-800 h-[35px]"
              placeholder="John Doe"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email */}
          <View className="mb-6 border-b border-gray-200">
            <Text className="text-gray-700 mb-1 font-pmedium">Email</Text>
            <TextInput
              className="text-gray-800 h-[35px]"
              placeholder="perdoruesi@shembull.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* role */}
          <View className='mb-6 border-gray-200'>
            <Text className='text-gray-700 mb-1 font-pmedium'>Lloji i llogarise</Text>
            <SegmentedControl 
                values={['Client', 'Driver']}
                selectedIndex={accountType}
                onChange={(event) => {setAccountType(event.nativeEvent.selectedSegmentIndex)}}
            />
          </View>

          {/* Password */}
          <View className={`border-b border-gray-200 ${!passwordError && "mb-6"}`}>
            <Text className="text-gray-700 mb-1 font-pmedium">Fjalëkalimi</Text>
            <TextInput
              className="text-gray-800 h-[35px]"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={(e) => {setPassword(e); setPasswordError("")}}
              secureTextEntry
            />
          </View>
            {passwordError ? <Text className="text-red-500 mb-6 text-sm mt-1">{passwordError}</Text> : null}

          {/* Confirm Password */}
          <View className={`border-b ${!confirmPasswordError && "mb-8"} border-gray-200`}>
            <Text className="text-gray-700 mb-1 font-pmedium">Konfirmo fjalëkalimin</Text>
            <TextInput
              className="text-gray-800 h-[35px]"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={(e) => {setConfirmPassword(e); setConfirmPasswordError("")}}
              secureTextEntry
            />
          </View>
            {confirmPasswordError ? <Text className="text-red-500 mb-8 text-sm mt-1">{confirmPasswordError}</Text> : null}

          {/* Sign Up Button */}
          <TouchableOpacity disabled={loading} onPress={handleSignUp} className={`bg-black rounded-full p-4 items-center mt-4 ${loading && "opacity-50"}`} activeOpacity={0.9}>
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
