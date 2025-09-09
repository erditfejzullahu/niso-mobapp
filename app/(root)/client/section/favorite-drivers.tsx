import ActiveDrivers from '@/components/client/ActiveDrivers'
import HeaderComponent from '@/components/HeaderComponent'
import EmptyState from '@/components/system/EmptyState'
import ErrorState from '@/components/system/ErrorState'
import LoadingState from '@/components/system/LoadingState'
import api from '@/hooks/useApi'
import { PassengerSectionDrivers } from '@/types/app-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowDownLeft, CirclePlus, UserStar } from 'lucide-react-native'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-toast-message'

const FavoriteDrivers = () => {
  
  const queryClient = useQueryClient();
  const [favoriteDrivers, setFavoriteDrivers] = useState<'favorites' | 'add'>('favorites')
    
  const {data, isLoading, isRefetching, refetch, error} = useQuery({
    queryKey: ['passenger_preferred_drivers', favoriteDrivers],
    queryFn: async () => {
      const res = await api.get<PassengerSectionDrivers[]>(`/passengers/preferred-drivers?preferredDrivers=${favoriteDrivers}`)
      return res.data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
  })

    const handleAddDriver = useMutation({
      mutationFn: async (data: { id: string, text?: string | null }) => {
        const payload = {
          driverId: data.id,
          whyPreferred: data.text
        }
        return await api.post('/passengers/preferred-drivers', payload);
      },
      onMutate: async (data: {id: string, text?: string | null}) => {
        await queryClient.cancelQueries({queryKey: ['passenger_preferred_drivers', favoriteDrivers]});

        const previousTarifs = queryClient.getQueryData(['passenger_preferred_drivers', favoriteDrivers]);

        queryClient.setQueryData(['passenger_preferred_drivers', favoriteDrivers], (old: any) => {
          return {
            ...old,
            data: old.data.filter((item: PassengerSectionDrivers) => item.id !== data.id)
          }
        })

        return {previousTarifs};
      },
      onError: (err: any, id, context) => {
        queryClient.setQueryData(['passenger_preferred_drivers', favoriteDrivers], context?.previousTarifs);

        Toast.show({
          type: "error",
          text1: "Gabim!",
          text2: err.response.data.message || "Dicka shkoi gabim ne shtimin e shoferit te preferuar."
        })

      },
      onSuccess: () => {
        setFavoriteDrivers("favorites");
        queryClient.invalidateQueries({queryKey: ['passenger_preferred_drivers', favoriteDrivers]})

        Toast.show({
          type: "success",
          text1: "Sukses!",
          text2: "Shoferi i preferuar u shtua me sukses!"
        })
      }
    })

    const deletePreferredDriver = useMutation({
      mutationFn: async (id: string) => {
        return await api.delete(`/passangers/delete-preferred/${id}`)
      },
      onMutate: async (id: string) => {
        await queryClient.cancelQueries({queryKey: ['passenger_preferred_drivers', favoriteDrivers]});

        const previousTarifs = queryClient.getQueryData(['passenger_preferred_drivers', favoriteDrivers]);

        queryClient.setQueryData(['passenger_preferred_drivers', favoriteDrivers], (old: any) => {
          return {
            ...old,
            data: old.data.filter((item: PassengerSectionDrivers) => item.id !== id)
          }
        })

        return {previousTarifs};
      },
      onError: (err: any, id, context) => {
        queryClient.setQueryData(['passenger_preferred_drivers', favoriteDrivers], context?.previousTarifs);

        Toast.show({
          type: "error",
          text1: "Gabim!",
          text2: err.response.data.message || "Dicka shkoi gabim ne fshirjen e shoferit te preferuar."
        })

      },
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Sukses!",
          text2: "Shoferi i preferuar u fshi me sukses!"
        })
      }
    })
    
  return (
    <KeyboardAwareScrollView className='p-4 bg-gray-50'>
        <HeaderComponent title={'Shoferët e preferuar'} subtitle={"Në këtë seksion mund të ndërveproni me shoferët tuaj të preferuar apo mund të shtoni shofer tjetër të preferuar"}/>
        <View className='flex-row flex-1 rounded-xl bg-white shadow-md shadow-black/5 mt-3'>
            <TouchableOpacity className='flex-1 border-r border-gray-300 flex-row items-center justify-center my-2 gap-1' onPress={() => setFavoriteDrivers("favorites")}>
                <Text className={`font-plight text-sm ${favoriteDrivers === "favorites" && 'text-indigo-600 !font-pmedium'}`}>Të preferuar</Text>
                <UserStar color={favoriteDrivers === "favorites" ? "#4f46e5" : "#1e1b4b"} size={16}/>
            </TouchableOpacity>
            <TouchableOpacity className='flex-1 flex-row items-center justify-center gap-1 my-2' onPress={() => setFavoriteDrivers("add")}>
                <Text className={`font-plight text-sm ${favoriteDrivers === "add" && 'text-indigo-600 !font-pmedium'}`}>Shtoni</Text>
                <CirclePlus color={favoriteDrivers === 'add' ? "#4f46e5" : "#1e1b4b"} size={16}/>
            </TouchableOpacity>
        </View>
        {favoriteDrivers === 'favorites' ? (
            <View className='gap-3 mt-3'>
              {(isLoading || isRefetching) ? (
                <LoadingState />
              ) : ((!isLoading && !isRefetching) && error) ? (
                <ErrorState onRetry={refetch}/>
              ) : !data || data.length === 0 ? (
                <EmptyState onRetry={refetch} message='Nuk u gjeten shofere te preferuar. Nese mendoni qe eshte gabim, ju lutem provoni perseri!' textStyle='!font-plight !text-sm'/>
              ) : (
                data.map(item => (
                  <ActiveDrivers driverActive={item} key={item.id} favoritePage deletePreferredDriver={(id) => deletePreferredDriver.mutate(id!)}/>
                ))
              )}
            </View>
        ) : (
            <View className='mt-3'>
                <View className='flex-row items-center gap-1 justify-end'>
                    <ArrowDownLeft size={16} color={"#4f46e5"}/>
                    <Text className='font-pregular text-sm'>Shoferët që keni udhëtuar me ta</Text>
                </View>

                <View className='gap-3 mt-3'>
                  {(isLoading || isRefetching) ? (
                    <LoadingState />
                  ) : ((!isLoading && !isRefetching) && error) ? (
                    <ErrorState onRetry={refetch}/>
                  ) : !data || data.length === 0 ? (
                    <EmptyState onRetry={refetch} message='Nuk u gjeten shofere te preferuar. Nese mendoni qe eshte gabim, ju lutem provoni perseri!' textStyle='!font-plight !text-sm'/>
                  ) : (
                    data.map(item => (
                      <ActiveDrivers driverActive={item} key={item.id} favoriteAddPage addDriver={(id, text) => handleAddDriver.mutate({ id, text })}/>
                    ))
                  )}
                </View>
            </View>
        )}
    </KeyboardAwareScrollView>
  )
}

export default FavoriteDrivers