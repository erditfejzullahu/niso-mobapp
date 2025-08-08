import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

const { width, height } = Dimensions.get('window');

const NisoLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scrollY = useSharedValue(0);
  const titleColor = useSharedValue(0); // For color animation
  const dotScale = useSharedValue(1);

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
      {/* Parallax Background (Car-themed) */}
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

      {/* Content */}
      <ScrollView 
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View className="h-64" /> {/* Spacer for parallax */}

        <View className="bg-white mx-6 rounded-3xl p-8 shadow-md shadow-black/15">
          {/* Animated "Niso" Title */}
          <View className="items-center mb-10">
            <Link href={'/_sitemap'}>Sitemap</Link>
            <Animated.Text 
              className="text-5xl font-bold mb-1 pt-1"
              style={animatedTitleStyle}
            >
              Niso<Animated.Text style={animatedDotStyle} className="text-black text-6xl">.</Animated.Text>
            </Animated.Text>
            <Text className="text-gray-600">Lëviz shpejt, lëviz me Niso.</Text>
          </View>

          {/* Email Input (Uber-like minimal style) */}
          <View className="mb-6 border-b border-gray-200">
            <Text className="text-gray-700 mb-1">Perdoruesi</Text>
            <TextInput
              className="text-gray-800 h-[35px]"
              placeholder="perdoruesi@shembull.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              // keyboardType="email-address"
              // autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text className="text-gray-700 mb-1">Fjalekalimi</Text>
            <TextInput
              className="border-b border-gray-200 pb-3 text-gray-800 text-lg"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button (Uber-like) */}
          <TouchableOpacity
            className="bg-black rounded-full p-4 items-center mt-4"
            activeOpacity={0.9}
          >
            <Text className="text-white font-bold text-lg">Kycuni</Text>
          </TouchableOpacity>

          {/* "Or continue with" divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-500">ose</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Social Login (Google, Apple) */}
          <View className="flex-row justify-center gap-2">
            <TouchableOpacity className="border border-gray-200 rounded-full p-3 flex-row items-center gap-2">
              <Text className="text-gray-800">Google</Text>
              <AntDesign name="google" size={24} color="#4f46e5" />
            </TouchableOpacity>
            <TouchableOpacity className="border border-gray-200 rounded-full p-3 flex-row items-center gap-2">
              <Text className="text-gray-800">Apple</Text>
              <AntDesign name="apple1" size={24} color="#4f46e5" />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View className="mt-8 items-center">
            <Text className="text-gray-600">Nuk keni llogari? </Text>
            <TouchableOpacity>
              <Link href={'/(auth)/sign-up'} >
                <Text className="text-black font-semibold">Regjistrohuni</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-20" /> {/* Bottom spacer */}
      </ScrollView>
    </View>
  );
};

export default NisoLogin;