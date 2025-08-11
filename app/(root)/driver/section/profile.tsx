import SupportSection from '@/components/SupportSection';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/sq';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { BounceInUp, Easing } from 'react-native-reanimated';

dayjs.locale('sq');

const Profile = () => {

  const [showProfileModal, setShowProfileModal] = useState(false);

  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [isContactingSupport, setIsContactingSupport] = useState(false)

  const user = {
    name: 'Ardit Krasniqi',
    role: 'Driver',
    photo: 'https://randomuser.me/api/portraits/men/42.jpg',
    totalDrives: 152,
    totalEarnings: 4250.75,
    regularClients: 12,
    rating: 4.8,
    joinDate: '2023-03-12',
  };

  return (
    <KeyboardAwareScrollView extraScrollHeight={20} className="flex-1 bg-gray-50 p-4" showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View className="bg-white rounded-2xl p-4 shadow-lg shadow-black/5 items-center">
        <Image
          source={{ uri: user.photo }}
          className="w-24 h-24 rounded-full mb-3"
        />
        <Text className="text-xl font-psemibold text-indigo-950">{user.name}</Text>
        <Text className="text-sm text-gray-500">{user.role}</Text>

        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text className="ml-1 text-gray-700">{user.rating.toFixed(1)}</Text>
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
        <View className="flex-1 bg-white rounded-2xl p-4 mr-2 shadow shadow-black/5 items-center">
          <Text className="text-lg font-psemibold text-indigo-950">{user.totalDrives}</Text>
          <Text className="text-xs text-gray-500 text-center font-pregular">Udhetime</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 mx-1 shadow shadow-black/5 items-center">
          <Text className="text-lg font-psemibold text-indigo-950">{user.regularClients}</Text>
          <Text className="text-xs text-gray-500 text-center font-pregular">Klientë të Rregullt</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 ml-2 shadow shadow-black/5 items-center">
          <Text className="text-lg font-psemibold text-indigo-950">€{user.totalEarnings.toFixed(2)}</Text>
          <Text className="text-xs text-gray-500 text-center font-pregular">Fitime</Text>
        </View>
      </View>

      {/* About Section */}
      <View className="bg-white rounded-2xl p-4 mt-4 shadow shadow-black/5">
        <Text className="text-sm text-gray-500 mb-1 font-pregular">Anëtar që nga</Text>
        <Text className="text-base font-pmedium text-indigo-950 ">
          {dayjs(user.joinDate).format('D MMMM YYYY')}
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
              <Text className='mb-1 text-gray-700 font-pmedium'>Fjalëkalimi i ri</Text>
              <TextInput
                secureTextEntry
                placeholder="********"
                className={`bg-white rounded-2xl px-4 py-3 shadow-sm shadow-black/10 border border-gray-200`}
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>
            <View >
              <Text className='mb-1 text-gray-700 font-pmedium'>Konfirmo fjalëkalimin e ri</Text>
              <TextInput
                secureTextEntry
                placeholder="********"
                className={`bg-white rounded-2xl px-4 py-3 shadow-sm shadow-black/10 border border-gray-200`}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
              />
            </View>
            <TouchableOpacity disabled={((newPassword !== confirmNewPassword) || (!newPassword || !confirmNewPassword))} className={`rounded-2xl mt-2 bg-indigo-600 p-3 ${((newPassword !== confirmNewPassword) || (!newPassword || !confirmNewPassword)) && "opacity-50"}`}><Text className='font-pregular text-center text-white'>Ndryshoni fjalëkalimin</Text></TouchableOpacity>
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
          <View className="bg-white rounded-2xl p-5 w-11/12">
            <Text className="text-lg font-psemibold text-indigo-950 mb-3">Përditëso Profilin</Text>
            <TextInput
              placeholder="Emri"
              defaultValue={user.name}
              className="border border-gray-200 font-pregular rounded-lg p-3 mb-3"
            />
            <TextInput
              placeholder="Roli"
              defaultValue={user.role}
              className="border border-gray-200 font-pregular rounded-lg p-3 mb-3"
            />
            <View className="flex-row justify-end">
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Text className="text-red-500 mr-4 font-pregular">Anulo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Text className="text-indigo-600 font-pregular">Ruaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View className='pb-[80px]'/>
    </KeyboardAwareScrollView>
  );
};

export default Profile;
