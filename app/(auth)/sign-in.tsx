import { useAuth } from '@/context/AuthContext';
import { auth } from '@/firebase';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';
import { AuthError, sendEmailVerification } from 'firebase/auth';
import { Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
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


const NisoLogin = () => {
  const { width, height } = Dimensions.get('window');
  const {currentUser, signOut} = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scrollY = useSharedValue(0);
  const titleColor = useSharedValue(0); // For color animation
  const dotScale = useSharedValue(1);

  const [resendEmail, setResendEmail] = useState(false)

  const [loading, setLoading] = useState(false)
  const {signIn} = useAuth();

  const handleResetEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser!);
      await signOut();
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message);
    }
    
    Toast.show({type: "success", text1: "Ridërgimi i emailit verifikues shkoi me sukses!"})
    setResendEmail(false)
  }

  const handleLogin = async () => {
    if(!email || !password){
      Toast.show({
        type: "error",
        text1: "Ju lutem mbushini të gjitha fushat"
      })
      return;
    }
    setLoading(true)
    try {
      await signIn(email, password)
      Toast.show({
        type: "success",
        text1: "Sapo u identifikuat me sukses në Niso."
      })
    } catch (error: any) {
      console.error(error);
      if(error.message === "verify email"){
        Toast.show({
            type: "error",
            text1: "Ju lutem verifikoni emailin tuaj."
        })
        setResendEmail(true)
        return;
      }
      Toast.show({
        type: "error",
        text1: "Dicka shkoi gabim!"
      })
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    dotScale.value = withRepeat(
      withTiming(1.3, {
        duration: 500,
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    )
  }, [])

  // Animate "Niso" text color (cycling between Uber-like colors)
  React.useEffect(() => {
    titleColor.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1, // Infinite loop
      true // Reverse animation
    );
  }, []);

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: dotScale.value}]
    }
  })

  // Parallax effects
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
      [1, 0.8],
      Extrapolation.CLAMP
    )
  }));

  
  // Animated "Niso" text color
  const animatedTitleStyle = useAnimatedStyle(() => {
    const hue = interpolate(
      titleColor.value,
      [0, 1],
      [0, 360],
      Extrapolation.CLAMP
    );
    return {
      color: `#4f46e5`, // Cycles through colors
      transform: [{ scale: withSpring(1 + Math.sin(titleColor.value * Math.PI) * 0.05 )}] // Subtle pulse
    };
  });

  const handleScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  return (
    <View className="flex-1 bg-gray-100">
      
      <Animated.View 
        className="absolute w-full h-96"
        style={backgroundLayer}
      >
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
          className="flex-1"
          blurRadius={2}
        >
          <View className="absolute inset-0 bg-black/85 opacity-80" />
        </ImageBackground>
      </Animated.View>

      
      <KeyboardAwareScrollView 
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View className="h-64" />

        <View className="bg-white mx-6 rounded-3xl p-8 shadow-md shadow-black/15">
          
          <View className="items-center mb-10">
            <Link href={'/_sitemap'}>Sitemap</Link>
            <Animated.Text 
              className="text-5xl font-pbold pt-3"
              style={animatedTitleStyle}
            >
              Niso<Animated.Text style={animatedDotStyle} className="text-black text-6xl">.</Animated.Text>
            </Animated.Text>
            <Text className="text-gray-600 font-pregular">Lëviz shpejt, lëviz me Niso.</Text>
          </View>

          
          <View className="mb-6 border-b border-gray-200">
            <Text className="text-gray-700 mb-1 font-pmedium">Përdoruesi</Text>
            <TextInput
              className="text-gray-800 h-[35px] font-pregular"
              placeholder="perdoruesi@shembull.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          
          <View className="mb-8">
            <Text className="text-gray-700 mb-1 font-pmedium">Fjalëkalimi</Text>
            <TextInput
              className="border-b border-gray-200 h-[35px] text-gray-800 font-pregular"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button (Uber-like) */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`bg-black rounded-full p-4 items-center mt-4 ${loading && "opacity-50"}`}
            activeOpacity={0.9}
          >
            <Text className="text-white font-pbold text-lg">Kycuni</Text>
          </TouchableOpacity>
          {resendEmail && <TouchableOpacity className='items-center mt-3 justify-center flex-row gap-1' onPress={handleResetEmail}>
            <Text className='font-pbold text-indigo-600 underline text-sm'>Ridërgo email-in</Text>
            <Mail color={"#4f46e5"} size={20}/>
          </TouchableOpacity>}

          {/* "Or continue with" divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-500 font-pregular pb-1">ose</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Social Login (Google, Apple) */}
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

          {/* Sign Up Link */}
          <View className="mt-8 items-center">
            <Text className="text-gray-600 font-pregular">Nuk keni llogari? </Text>
            <Link href={'/(auth)/sign-up'} >
              <Text className="text-black font-psemibold">Regjistrohuni</Text>
            </Link>
          </View>
        </View>

        <View className="h-20" />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default NisoLogin;