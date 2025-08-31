import { useAuth } from '@/context/AuthContext';
import { Link, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View, ScrollView, Alert, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { KosovoCity } from '@/types/app-types';
import api from '@/hooks/useApi';
import * as ImageManipulator from 'expo-image-manipulator';

const VerifyIdentity = () => {
  const { width, height } = Dimensions.get('window');
  const scrollY = useSharedValue(0);
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('MALE');
  const [selfie, setSelfie] = useState<string | null>(null);
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [citiesShown, setCitiesShown] = useState<string[]>([]);
  const [showCitiesDropdown, setShowCitiesDropdown] = useState(false);
  const [cityInputFocused, setCityInputFocused] = useState(false);

  // Get all Kosovo cities from the enum
  const allKosovoCities = Object.values(KosovoCity);
  
  const { user, updateSession } = useAuth();
  
  if(user && user.user_verified) {
    router.replace(user.role === "DRIVER" ? "/driver/section/active-routes" : "/client/section/client-home")
  }
  

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

  const handleScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  // Filter cities based on input
  const filterCities = (input: string) => {
    if (!input) {
      setCitiesShown(allKosovoCities);
      return;
    }
    
    const filtered = allKosovoCities.filter(city => 
      city.toLowerCase().includes(input.toLowerCase())
    );
    setCitiesShown(filtered);
  };

  // Handle city input change
  const handleCityChange = (text: string) => {
    setCity(text);
    filterCities(text);
    setShowCitiesDropdown(true);
  };

  // Select a city from the dropdown
  const selectCity = (selectedCity: string) => {
    setCity(selectedCity);
    setShowCitiesDropdown(false);
  };

  // Initialize cities when component mounts
  useEffect(() => {
    setCitiesShown(allKosovoCities);
  }, []);

  const pickImage = async (type: any) => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    let imagePicked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!imagePicked.canceled) {
      try {
        const imageContext = ImageManipulator.ImageManipulator.manipulate(imagePicked.assets[0].uri)
        const image = await imageContext.renderAsync();
        const result = await image.saveAsync({
          compress: 0.7,
          format: ImageManipulator.SaveFormat.WEBP
        })
        if (type === 'selfie') {
          setSelfie(result.uri);
        } else if (type === 'idFront') {
          setIdFront(result.uri);
        } else if (type === 'idBack') {
          setIdBack(result.uri);
        }
      } catch (error) {
        console.error("error converting image ", error);
        if (type === 'selfie') {
          setSelfie("");
        } else if (type === 'idFront') {
          setIdFront("");
        } else if (type === 'idBack') {
          setIdBack("");
        }
      }
    }
  };

  const takeSelfie = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    // Launch camera
    let imagePicked = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!imagePicked.canceled) {
      const imageContext = ImageManipulator.ImageManipulator.manipulate(imagePicked.assets[0].uri)
      const image = await imageContext.renderAsync();
      const result = await image.saveAsync({
        compress: 0.7,
        format: ImageManipulator.SaveFormat.WEBP
      })
      setSelfie(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!address || !city || !gender || !selfie || !idFront || !idBack) {
      Toast.show({
        type: "error",
        text1: "Gabim",
        text2: "Ju lutem plotësoni të gjitha fushat dhe ngarkoni të gjitha fotot"
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // Append basic user data
      formData.append('address', address);
      formData.append('city', city);
      formData.append('gender', gender);

      // Append selfie
      const selfieFilename = selfie.split('/').pop() || 'selfie.jpg';
      const selfieMatch = /\.(\w+)$/.exec(selfieFilename);
      const selfieType = selfieMatch ? `image/${selfieMatch[1]}` : 'image/jpeg';
      
      formData.append('selfie', {
        uri: selfie,
        name: selfieFilename,
        type: selfieType,
      } as any);

      // Append ID cards with the same field name (id_cards)
      const idFrontFilename = idFront.split('/').pop() || 'id_front.jpg';
      const idFrontMatch = /\.(\w+)$/.exec(idFrontFilename);
      const idFrontType = idFrontMatch ? `image/${idFrontMatch[1]}` : 'image/jpeg';
      
      formData.append('id_card', {
        uri: idFront,
        name: idFrontFilename,
        type: idFrontType,
      } as any);

      const idBackFilename = idBack.split('/').pop() || 'id_back.jpg';
      const idBackMatch = /\.(\w+)$/.exec(idBackFilename);
      const idBackType = idBackMatch ? `image/${idBackMatch[1]}` : 'image/jpeg';
      
      formData.append('id_card', {
        uri: idBack,
        name: idBackFilename,
        type: idBackType,
      } as any);

      // Make API call with FormData
      const res = await api.post('/auth/verify-identity', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });      
      if(res.data.success){
        await updateSession();
      }
      
      Toast.show({
        type: "success",
        text1: "Identiteti u verifikua me sukses!"
      });
      
      // Navigate to the next screen
      // router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error.response.data.message);
      
      console.error('Verification error:', error);
      Toast.show({
        type: "error",
        text1: "Diçka shkoi keq. Ju lutem provoni përsëri.",
        text2: error.response?.data?.message || 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
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
            <Text className="text-3xl font-pbold pt-3 text-indigo-600">Verifikoni Identitetin</Text>
            <Text className="text-gray-600 font-pregular text-center mt-2">
              Plotësoni informacionin e mëposhtëm për të verifikuar identitetin tuaj
            </Text>
          </View>

          {/* Address Field */}
          <View className="mb-6 border-b border-gray-200">
            <Text className="text-gray-700 mb-1 font-pmedium">Adresa</Text>
            <TextInput
              className="text-gray-800 h-[35px] font-pregular"
              placeholder="Shkruani adresën tuaj të plotë"
              placeholderTextColor="#9CA3AF"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* City Field */}
          <View className="mb-2 border-b border-gray-200 relative z-10">
            <Text className="text-gray-700 mb-1 font-pmedium">Qyteti</Text>
            <TextInput
              className="text-gray-800 h-[35px] font-pregular"
              placeholder="Shkruani qytetin"
              placeholderTextColor="#9CA3AF"
              value={city}
              onChangeText={handleCityChange}
              onFocus={() => {
                setCityInputFocused(true);
                setShowCitiesDropdown(true);
              }}
              onBlur={() => setCityInputFocused(false)}
            />
            
            {/* Cities Dropdown */}
            {showCitiesDropdown && citiesShown.length > 0 && (
              <View className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-40 shadow-lg shadow-black/20 z-20">
                <ScrollView 
                  className="max-h-40"
                  keyboardShouldPersistTaps="handled"
                >
                  {citiesShown.map((cityName, index) => (
                    <TouchableOpacity
                      key={index}
                      className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                      onPress={() => selectCity(cityName)}
                    >
                      <Text className="text-gray-800 font-pregular">{cityName}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Gender Field */}
          <View className="mb-6  border-gray-200">
            <Text className="text-gray-700 mb-1 font-pmedium">Gjinia</Text>
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity 
                className={`flex-1 mr-2 py-3 rounded-lg border ${gender === 'MALE' ? 'bg-indigo-100 border-indigo-600' : 'border-gray-300'}`}
                onPress={() => setGender('MALE')}
              >
                <Text className={`text-center font-pmedium ${gender === 'MALE' ? 'text-indigo-600' : 'text-gray-600'}`}>Mashkull</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={`flex-1 ml-2 py-3 rounded-lg border ${gender === 'FEMALE' ? 'bg-indigo-100 border-indigo-600' : 'border-gray-300'}`}
                onPress={() => setGender('FEMALE')}
              >
                <Text className={`text-center font-pmedium ${gender === 'FEMALE' ? 'text-indigo-600' : 'text-gray-600'}`}>Femër</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              className={`flex-1 mt-2 py-3 rounded-lg border ${gender === 'RATHER_NOT_SAY' ? 'bg-indigo-100 border-indigo-600' : 'border-gray-300'}`}
              onPress={() => setGender('RATHER_NOT_SAY')}
            >
              <Text className={`text-center font-pmedium ${gender === 'RATHER_NOT_SAY' ? 'text-indigo-600' : 'text-gray-600'}`}>Tjeter</Text>
            </TouchableOpacity>
          </View>

          {/* Selfie Upload */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-3 font-pmedium">Selfie</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className="flex-1 mr-2 items-center justify-center py-4 border border-dashed border-gray-400 rounded-lg"
                onPress={takeSelfie}
              >
                <Ionicons name="camera" size={24} color="#4f46e5" />
                <Text className="text-indigo-600 font-pregular mt-1 text-center px-1">Bëni foto</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 ml-2 items-center justify-center py-4 border border-dashed border-gray-400 rounded-lg"
                onPress={() => pickImage('selfie')}
              >
                <MaterialIcons name="photo-library" size={24} color="#4f46e5" />
                <Text className="text-indigo-600 font-pregular mt-1 text-center px-1">Zgjidhni nga galeria</Text>
              </TouchableOpacity>
            </View>
            {selfie && (
              <View className="mt-4 items-center">
                <Image source={{ uri: selfie }} className="w-32 h-32 rounded-lg" />
                <TouchableOpacity onPress={() => setSelfie(null)} className="mt-2">
                  <Text className="text-red-500 font-pregular">Hiq foton</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ID Card Upload (Front) */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-3 font-pmedium">Letërnjoftimi (Ana e përparme)</Text>
            <TouchableOpacity 
              className="items-center justify-center py-6 border border-dashed border-gray-400 rounded-lg"
              onPress={() => pickImage('idFront')}
            >
              <FontAwesome name="id-card-o" size={24} color="#4f46e5" />
              <Text className="text-indigo-600 font-pregular mt-2 px-1 text-center">Ngarkoni anën e përparme</Text>
            </TouchableOpacity>
            {idFront && (
              <View className="mt-4 items-center">
                <Image source={{ uri: idFront }} className="w-full h-48 rounded-lg" resizeMode="contain" />
                <TouchableOpacity onPress={() => setIdFront(null)} className="mt-2">
                  <Text className="text-red-500 font-pregular px-1 text-center">Hiq foton</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ID Card Upload (Back) */}
          <View className="mb-8">
            <Text className="text-gray-700 mb-3 font-pmedium">Letërnjoftimi (Ana e pasme)</Text>
            <TouchableOpacity 
              className="items-center justify-center py-6 border border-dashed border-gray-400 rounded-lg"
              onPress={() => pickImage('idBack')}
            >
              <FontAwesome name="id-card" size={24} color="#4f46e5" />
              <Text className="text-indigo-600 font-pregular mt-2 px-1 text-center">Ngarkoni anën e pasme</Text>
            </TouchableOpacity>
            {idBack && (
              <View className="mt-4 items-center">
                <Image source={{ uri: idBack }} className="w-full h-48 rounded-lg" resizeMode="contain" />
                <TouchableOpacity onPress={() => setIdBack(null)} className="mt-2">
                  <Text className="text-red-500 font-pregular px-1 text-center">Hiq foton</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`bg-indigo-600 rounded-full p-4 items-center mt-4 ${loading && "opacity-50"}`}
            activeOpacity={0.9}
          >
            <Text className="text-white font-pbold text-lg">
              {loading ? "Po verifikohet..." : "Verifiko Identitetin"}
            </Text>
          </TouchableOpacity>

          <View className="mt-8 items-center">
            <Text className="text-gray-600 font-pregular">Duke u kthyer prapa? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-indigo-600 font-psemibold">Kthehu mbrapa</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-20" />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default VerifyIdentity;