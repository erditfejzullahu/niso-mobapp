import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

const NisoSignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      <ScrollView className="flex-1" onScroll={handleScroll} scrollEventThrottle={16}>
        <View className="h-64" /> {/* Spacer */}

        <View className="bg-white mx-6 rounded-3xl p-8 shadow-lg border border-gray-100">
          {/* Title */}
          <View className="items-center mb-10">
            <Animated.Text className="text-5xl font-bold mb-1 pt-1" style={animatedTitleStyle}>
              Regjistrohu<Animated.Text style={animatedDotStyle} className="text-black text-6xl">.</Animated.Text>
            </Animated.Text>
            <Text className="text-gray-600 text-center">
              Krijoni një llogari për të lëvizur shpejt me Niso.
            </Text>
          </View>

          {/* Full Name */}
          <View className="mb-6 border-b border-gray-200">
            <Text className="text-gray-700 mb-1">Emri i plotë</Text>
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
            <Text className="text-gray-700 mb-1">Email</Text>
            <TextInput
              className="text-gray-800 h-[35px]"
              placeholder="perdoruesi@shembull.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View className="mb-6 border-b border-gray-200">
            <Text className="text-gray-700 mb-1">Fjalëkalimi</Text>
            <TextInput
              className="text-gray-800 h-[35px]"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Confirm Password */}
          <View className="mb-8 border-b border-gray-200">
            <Text className="text-gray-700 mb-1">Konfirmo fjalëkalimin</Text>
            <TextInput
              className="text-gray-800 h-[35px]"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity className="bg-black rounded-full p-4 items-center mt-4" activeOpacity={0.9}>
            <Text className="text-white font-bold text-lg">Krijo Llogari</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-500">ose</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Social Buttons */}
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

          {/* Login Link */}
          <View className="mt-8 items-center">
            <Text className="text-gray-600">Keni tashmë një llogari? </Text>
            <TouchableOpacity>
                <Link href={'/(auth)/sign-in'}>
                    <Text className="text-black font-semibold">Kyçuni</Text>
                </Link>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default NisoSignUp;
