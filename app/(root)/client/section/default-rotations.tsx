import ClientRotationCard from '@/components/client/ClientRotationCard'
import HeaderComponent from '@/components/HeaderComponent'
import ErrorState from '@/components/system/ErrorState'
import LoadingState from '@/components/system/LoadingState'
import api from '@/hooks/useApi'
import { PassengerRotation } from '@/types/app-types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Plus } from 'lucide-react-native'
import React from 'react'
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-toast-message'

const DefaultRotations = () => { //psh rotacion tperditshem prej pune shpi prej shpije pun
  const queryClient = useQueryClient();

  const {data, isLoading, isRefetching, error, refetch} = useQuery({
    queryKey: ['default-rotations'],
    queryFn: async () => {
      const res = await api.get<PassengerRotation[]>('/passengers/passenger-rotations')
      return res.data;
    }
  })

  const handleDeleteRotation = async (id: string) => {
    try {
      const res = await api.delete(`/passengers/delete-rotation/${id}`);
      if(res.data.success){
        Toast.show({
          type: "success",
          text1: "Sukses",
          text2: "Sapo fshite me sukses rotacionin tuaj."
        })
        queryClient.invalidateQueries({queryKey: ['default-rotations']});
      }
    } catch (error: any) {
      Toast.show({
          type: "error",
          text1: "Gabim",
          text2: error.response.data.message || "Dicka shkoi gabim, ju lutem provoni perseri."
        })
    }
  }

  if(isLoading || isRefetching) return ( <LoadingState /> )

  if((!isLoading || !isRefetching) && error) return (<ErrorState onRetry={refetch} />)    

  return (
    <KeyboardAwareFlatList 
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={['#4f46e5']} // Indigo color for iOS
          tintColor="#4f46e5" // iOS spinner color
          progressBackgroundColor="#ffffff" // iOS background
        />
      }
      showsVerticalScrollIndicator={false}
      className='bg-gray-50'
      contentContainerStyle={{ padding: 16, paddingBottom: 80, gap: 16 }}
      data={data}
      renderItem={({item}) => (
        <ClientRotationCard onDelete={(id) => handleDeleteRotation(id)} {...item}/>
      )}
      ListHeaderComponent={() => (
        <View className='gap-3'>
          <HeaderComponent title={"Rotacionet tua"} subtitle={"Nga ky seksion ju mund të krijoni rotacione ditore nga një destinacion tek një destinacion tjetër. P.sh. nga puna në banesë"}/>
          <TouchableOpacity onPress={() => router.push('/client/section/create-rotation')} className='py-3 bg-indigo-600 rounded-xl items-center justify-center flex-row gap-1'>
            <Text className="font-pmedium text-white">Shtoni rotacion</Text>
            <Plus color={"#fff"} size={18}/>
          </TouchableOpacity>
        </View>
      )}
    />
  )
}

export default DefaultRotations