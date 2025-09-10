import SupportSection from '@/components/SupportSection';
import ErrorState from '@/components/system/ErrorState';
import LoadingState from '@/components/system/LoadingState';
import TextField from '@/components/TextField';
import { useAuth } from '@/context/AuthContext';
import api from '@/hooks/useApi';
import { userDetailsSchema } from '@/schemas/userDetailsSchema';
import { Gender, KosovoCity, UserProfileDetails } from '@/types/app-types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/sq';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, Modal, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { BounceInUp, Easing } from 'react-native-reanimated';
import {z} from 'zod';
import * as ImagePicker from "expo-image-picker"
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';
import * as ImageManipulator from "expo-image-manipulator"
import { passwordResetSchema } from '@/schemas/passwordResetSchema';
import { Check, Smile } from 'lucide-react-native';

dayjs.locale('sq');

const Profile = () => {

  const queryClient = useQueryClient();

  const {user, updateSession} = useAuth();

  if(!user) return (
    <ErrorState message='Sesioni juaj ka skaduar, ju lutem kycuni perseri...' onRetry={updateSession} retryButtonText='Rifreskoni sesionin'/>
  )

  const {data, isLoading, error, refetch, isRefetching} = useQuery({
    queryKey: ['userProfileDetails'],
    queryFn: async () => {
      return await api.get<UserProfileDetails>('/auth/profile-details')
    },
    refetchOnWindowFocus: false,
    enabled: !!user
  })



  const [showProfileModal, setShowProfileModal] = useState(false);

  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [isContactingSupport, setIsContactingSupport] = useState(false)

  
  const {control, reset, handleSubmit, formState: {errors, isSubmitting}} = useForm<z.infer<typeof userDetailsSchema>>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: useMemo(() => ({
      fullName: "",
      image: "",
      email: "",
      address: "",
      city: KosovoCity.PRISHTINE,
      gender: Gender.MALE
    }), []),
    mode: "onChange"
  })
  
  const {control: passwordControl, watch: passwordWatcher, reset: resetPasswords, handleSubmit: passwordResetSubmit, formState: {errors: passwordErrors, isSubmitting: passwordIsSubmitting}} = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: useMemo(() => ({
      password: "",
      confirmPassword: ""
    }), []),
    mode: "onChange"
  })
  
  const pickImage = useCallback(async (onChange: (value: string) => void) => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your photos');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled) {
        // Get the first asset (image)
        const imageUri = result.assets[0].uri;
        try {
          const imageContext = ImageManipulator.ImageManipulator.manipulate(imageUri)
          const image = await imageContext.renderAsync();
          const result = await image.saveAsync({
            compress: 0.7,
            format: ImageManipulator.SaveFormat.WEBP
          })
          onChange(result.uri);
        } catch (error) {
          console.error("error converting image ", error);
          onChange("");
        }
        
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Image picker error:', error);
    }
  }, [reset]);

  const updateUserDetails = useCallback(async (data: z.infer<typeof userDetailsSchema>) => {
    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('gender', data.gender);
      formData.append('email', data.email);

      const filename = data.image.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('profileImage', {
        uri: data.image,
        name: filename,
        type,
      } as any);  

      const res = await api.patch('/auth/updateUserInformation', formData, {
        headers: {
          'Content-Type' :"multipart/form-data",
        },
        withCredentials: true
      })
      if(res.data.success) {
        await updateSession();
        queryClient.invalidateQueries({
          queryKey: ['userProfileDetails']
        })
        setShowProfileModal(false);
        Toast.show({
          type: "success",
          text1: "Sukses!",
          text2: "Profili u perditesua me sukses"
        });
      }

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Gabim!",
        text2: error.response.data.message
      })
    }
  }, [reset])

  const updateUserPassword = useCallback(async (data: z.infer<typeof passwordResetSchema>) => {
    try {
      if(data.password !== data.confirmPassword) {
        Toast.show({
          type: 'error',
          text1: "Gabim!",
          text2: "Fjalekalimet duhet te jene te njejta."
        })
        return;
      }
      
      const res = await api.patch('/auth/updatePassword', data);
      if(res.data.success){
        Toast.show({
          type: "success",
          text1: "Sukses!",
          text2: "Sapo keni ndryshuar fjalekalimin me sukses!"
        })
        setIsChangingPassword(false);
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Gabim!",
        text2: error.response.data.message
      })
    }
  }, [resetPasswords])

  useEffect(() => {
    if(!isChangingPassword){
      resetPasswords();
    }
  }, [isChangingPassword])
  

  useEffect(() => {
    if(data && data.data){
      reset({
        city: data.data.profileDetails.userInformations.city,
        gender: data.data.profileDetails.userInformations.gender,
        address: data.data.profileDetails.userInformations.address,
        image: user.image,
        fullName: user.fullName,
        email: user.email
      })
    }
  }, [data, reset, user])
  
  if(isLoading || isRefetching) return ( <LoadingState /> )

  if((!isLoading || !isRefetching) && error) return (<ErrorState onRetry={refetch} />)

  if(!data) return (<ErrorState onRetry={refetch} retryButtonText='Provoni perseri' message='Nuk u gjeten te dhenat tua. Nese mendoni qe eshte gabim klikoni me poshte'/>)

  return (
    <KeyboardAwareScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={['#4f46e5']} // Indigo color for iOS
          tintColor="#4f46e5" // iOS spinner color
          progressBackgroundColor="#ffffff" // iOS background
        />
      }
      extraScrollHeight={20} className="flex-1 bg-gray-50 p-4 " showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View className="bg-white rounded-2xl p-4 shadow-lg shadow-black/5 items-center relative">
        {user.user_verified && <View className='absolute bg-indigo-600 rounded-full -top-1 -right-1 p-1 shadow-lg shadow-black/40'>
          <Check color={"#fff"} size={16}/>
        </View>}

        <Image
          source={{ uri: user.image }}
          className="w-24 h-24 rounded-full mb-3"
        />
        <Text className="text-xl font-psemibold text-indigo-950">{user.fullName}</Text>
        <Text className="text-sm text-gray-500">{user.role === "DRIVER" && "Shofer"}</Text>

        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text className="ml-1 text-gray-700">4.8</Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowProfileModal(true)}
          className="mt-3 bg-indigo-600 px-4 py-2 rounded-full"
        >
          <Text className="text-white font-pmedium">Përditëso Profilin</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-between mt-4">
        <View className="flex-1 bg-white rounded-2xl p-4 mr-2 shadow shadow-black/5 items-center justify-center">
          <Text className="text-lg font-psemibold text-indigo-950">{data.data.profileDetails.completedRides}</Text>
          <Text className="text-xs text-gray-500 text-center font-pregular">Udhetime</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 mx-1 shadow shadow-black/5 items-center justify-center">
          <Text className="text-lg font-psemibold text-indigo-950">{data.data.profileDetails.regularClients}</Text>
          <Text className="text-xs text-gray-500 text-center font-pregular">Klientë të Rregullt</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 ml-2 shadow shadow-black/5 items-center justify-center">
          <Text className="text-lg font-psemibold text-indigo-950">€{data.data.profileDetails.driverNetEarnings}</Text>
          <Text className="text-xs text-gray-500 text-center font-pregular">Fitime</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => router.push('/(root)/driver/section/driver-reviews')} className='rounded-2xl py-3 mt-4 flex-row gap-1.5 bg-indigo-600 items-center justify-center'>
        <Text className='text-white font-pmedium'>Shiko vleresimet ndaj teje</Text>
        <Smile color={"#fff"}/>
      </TouchableOpacity>

      {/* About Section */}
      <View className="bg-white rounded-2xl p-4 mt-4 shadow shadow-black/5">
        <Text className="text-sm text-gray-500 mb-1 font-pregular">Anëtar që nga</Text>
        <Text className="text-base font-pmedium text-indigo-950 ">
          {dayjs(user.createdAt).format('D MMMM YYYY')}
        </Text>
      </View>

      {/* Navigation Actions */}
      <View className="bg-white rounded-2xl p-4 mt-4 shadow shadow-black/5">
        <TouchableOpacity
          className="flex-row items-center py-3 border-b border-gray-100"
          onPress={() => router.push('/driver/section/statistics')}
        >
          <Ionicons name="wallet" size={20} color="#4338ca" />
          <Text className="ml-3 text-indigo-950 font-pmedium">Shiko Financat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3 border-b border-gray-100"
          onPress={() => router.push('/driver/section/view-tarifs')}
        >
          <Ionicons name="pricetags" size={20} color="#4338ca" />
          <Text className="ml-3 text-indigo-950 font-pmedium">Shiko tarifat tua</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3 border-b border-gray-100"
          onPress={() => router.push('/driver/section/regular-clients')}
        >
          <Ionicons name="people" size={20} color="#4338ca" />
          <Text className="ml-3 text-indigo-950 font-pmedium">Klientët e Rregullt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-row items-center py-3 border-b border-gray-100 ${isChangingPassword && "bg-indigo-200 px-4 rounded-lg"}`}
          onPress={() => setIsChangingPassword(!isChangingPassword)}
        >
          <MaterialIcons name="password" size={20} color="#4338ca" />
          <Text className="ml-3 text-indigo-950 font-pmedium">Ndrysho fjalëkalimin</Text>
        </TouchableOpacity>
        {isChangingPassword && <View className='overflow-hidden'><Animated.View entering={BounceInUp.easing(Easing.inOut(Easing.bounce))} className='p-4'>
          <View className='mb-4'>
            <Controller 
              control={passwordControl}
              name="password"
              render={({field}) => (
                <>
                <Text className='mb-1 text-gray-700 font-pmedium'>Fjalëkalimi i ri</Text>
                <TextInput
                  secureTextEntry
                  placeholder="********"
                  className={`bg-white rounded-2xl px-4 py-3 shadow-sm shadow-black/10 border border-gray-200`}
                  value={field.value}
                  onChangeText={field.onChange}
                />
                </>  
              )}
              />
              {passwordErrors.password && (
                <Text className='text-xs font-plight text-red-500 mt-1'>{passwordErrors.password.message}</Text>
              )}
            </View>
            <View>
              <Controller 
                control={passwordControl}
                name="confirmPassword"
                render={({field}) => (
                  <>
                  <Text className='mb-1 text-gray-700 font-pmedium'>Konfirmo fjalëkalimin e ri</Text>
                  <TextInput
                    secureTextEntry
                    placeholder="********"
                    className={`bg-white rounded-2xl px-4 py-3 shadow-sm shadow-black/10 border border-gray-200`}
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                  </>
                )}
              />
              {passwordErrors.confirmPassword && (
                <Text className='text-xs font-plight text-red-500 mt-1'>{passwordErrors.confirmPassword.message}</Text>
              )}
            </View>
            <TouchableOpacity onPress={passwordResetSubmit(updateUserPassword)} disabled={passwordIsSubmitting || (passwordWatcher('password') !== passwordWatcher('confirmPassword')) || (!passwordWatcher('password') || !passwordWatcher('confirmPassword'))} className={`rounded-2xl mt-2 bg-indigo-600 p-3 ${(passwordIsSubmitting || (passwordWatcher('password') !== passwordWatcher('confirmPassword')) || (!passwordWatcher('password') || !passwordWatcher('confirmPassword'))) && "opacity-50"}`}><Text className='font-pregular text-center text-white'>Ndryshoni fjalëkalimin</Text></TouchableOpacity>
        </Animated.View></View>}

        <TouchableOpacity
          className={`flex-row items-center py-3 ${isContactingSupport && "bg-indigo-200 px-4 rounded-lg"}`}
          onPress={() => setIsContactingSupport(!isContactingSupport)}
        >
          <MaterialIcons name="support-agent" size={20} color="#4338ca" />
          <Text className="ml-3 text-indigo-950 font-pmedium">Mbështetja teknike</Text>
        </TouchableOpacity>
        {isContactingSupport && (
          <View className='overflow-hidden'>
            <Animated.View entering={BounceInUp.easing(Easing.inOut(Easing.bounce))} className='p-4'>
              <SupportSection />
            </Animated.View>
          </View>
        )}
      </View>

      {/* Update Profile Modal */}
      <Modal visible={showProfileModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-2xl p-5 w-11/12 m-auto ">
          <KeyboardAwareScrollView>
            <Text className="text-lg font-psemibold text-indigo-950 mb-3">Përditëso Profilin</Text>

            <View className='mb-3'>
              <Controller 
                control={control}
                name="image"
                render={({ field: { value, onChange } }) => (
                  <View className="items-center">
                    <TouchableOpacity 
                      onPress={() => pickImage(onChange)}
                      className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center border-2 border-dashed border-gray-300"
                    >
                      {value ? (
                        <Image 
                          source={{ uri: value }} 
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <Ionicons name="camera" size={32} color="#6b7280" />
                      )}
                    </TouchableOpacity>
                    <Text className="text-sm text-gray-600 mt-2">
                      Klikoni per te {value ? 'ndryshuar' : 'shtuar'} foton
                    </Text>
                  </View>
                )}
              />
              {errors.image && (
                <Text className='text-xs font-plight text-red-500 mt-1'>{errors.image.message}</Text>
              )}
            </View>

            <View className='mb-3'>
              <Controller 
                control={control}
                name="fullName"
                render={({field}) => (
                  <TextField 
                    title='Emri juaj'
                    placeholder='Shkruani emrin tuaj ketu...'
                    {...field}
                    onChangeText={(e) => field.onChange(e)}
                  />
                )}
              />
              {errors.fullName && (
                <Text className='text-xs font-plight text-red-500 mt-1'>{errors.fullName.message}</Text>
              )}
            </View>
            <View className='mb-3'>
              <Controller 
                control={control}
                name="address"
                render={({field}) => (
                  <TextField 
                    title='Adresa juaj'
                    placeholder='Shkruani adresen tuaj ketu...'
                    {...field}
                    onChangeText={(e) => field.onChange(e)}
                  />
                )}
              />
              {errors.address && (
                <Text className='text-xs font-plight text-red-500 mt-1'>{errors.address.message}</Text>
              )}
            </View>
            <View className='mb-3'>
              <Controller 
                control={control}
                name="email"
                render={({field}) => (
                  <>
                  <TextField 
                    title='Emaili juaj'
                    placeholder='Shkruani emailin tuaj ketu...'
                    {...field}
                    onChangeText={(e) => field.onChange(e)}
                  />
                  <Text className='text-xs font-plight text-gray-600 mt-1'><Text className='text-indigo-600 font-pmedium'>Vemendje:</Text> Emaili i ri duhet verifikuar per te vazhduar perdorimin e platformes Niso.</Text>
                  </>
                )}
              />
              {errors.email && (
                <Text className='text-xs font-plight text-red-500 mt-1'>{errors.email.message}</Text>
              )}
            </View>
            <View className='mb-3'>
              <Controller 
                control={control}
                name="gender"
                render={({field}) => (
                  <View className="mb-6  border-gray-200">
                    <Text className="text-gray-700 mb-1 font-pmedium">Gjinia</Text>
                    <View className="flex-row justify-between mt-2">
                      <TouchableOpacity 
                        className={`flex-1 mr-2 py-3 rounded-lg border ${field.value === 'MALE' ? 'bg-indigo-100 border-indigo-600' : 'border-gray-300'}`}
                        onPress={() => field.onChange('MALE')}
                      >
                        <Text className={`text-center font-pmedium ${field.value === 'MALE' ? 'text-indigo-600' : 'text-gray-600'}`}>Mashkull</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        className={`flex-1 ml-2 py-3 rounded-lg border ${field.value === 'FEMALE' ? 'bg-indigo-100 border-indigo-600' : 'border-gray-300'}`}
                        onPress={() => field.onChange('FEMALE')}
                      >
                        <Text className={`text-center font-pmedium ${field.value === 'FEMALE' ? 'text-indigo-600' : 'text-gray-600'}`}>Femër</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                      className={`flex-1 mt-2 py-3 rounded-lg border ${field.value === 'RATHER_NOT_SAY' ? 'bg-indigo-100 border-indigo-600' : 'border-gray-300'}`}
                      onPress={() => field.onChange('RATHER_NOT_SAY')}
                    >
                      <Text className={`text-center font-pmedium ${field.value === 'RATHER_NOT_SAY' ? 'text-indigo-600' : 'text-gray-600'}`}>Tjeter</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.gender && (
                <Text className='text-xs font-plight text-red-500 mt-1'>Ju lutem zgjidhni mes opsioneve</Text>
              )}
            </View>
            
            
            <View className="flex-row justify-end">
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Text className="text-red-500 mr-4 font-pregular">Anulo</Text>
              </TouchableOpacity>
              <TouchableOpacity className={`${isSubmitting && "opacity-20"}`} disabled={isSubmitting} onPress={handleSubmit(updateUserDetails)}>
                <Text className="text-indigo-600 font-pregular">Ruaj</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
          </View>
        </View>
      </Modal>

      <View className='pb-[80px]'/>
    </KeyboardAwareScrollView>
  );
};

export default Profile;
