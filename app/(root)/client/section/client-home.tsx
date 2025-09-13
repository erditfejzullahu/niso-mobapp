import ActiveTransport from '@/components/client/ActiveTransport'
import HeaderComponent from '@/components/HeaderComponent'
import { Plus } from 'lucide-react-native'
import React, { Suspense, useEffect, useState } from 'react'
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Animated, { Easing, FadeInLeft } from 'react-native-reanimated'

import ActiveRidesCount from '@/components/ActiveRidesCount'
import HomeActiveDriversWrapper from '@/components/client/HomeActiveDriversWrapper'
import dayjs from "dayjs"
import { router, useRouter } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import { QueryObserverResult, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import api from '@/hooks/useApi'
import { PassengersHomeResponse, User } from '@/types/app-types'
import LoadingState from '@/components/system/LoadingState'

const ClientHome = () => {
  const router = useRouter();
  const {user} = useAuth();
  const [refetchFunction, setRefetchFunction] = useState<(() => Promise<QueryObserverResult>) | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  if(!user){router.push('/sign-in');return;}
  
  const handleRefresh = async () => {
    if (refetchFunction) {
      setIsRefreshing(true);
      try {
        await refetchFunction();
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      className='bg-gray-50' 
      contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#4f46e5']}
          tintColor="#4f46e5"
          progressBackgroundColor="#ffffff"
        />
      }
      >
      <View className='gap-3'>
        <HeaderComponent 
          title={<>Mirësevini, <Text className='text-indigo-600'>{user.fullName}</Text></>} textStyle={"!font-pmedium !text-2xl"}
          subtitle={"Këtu mund të ndërveproni me veçoritë kyçe të Niso."} imageStyle={"!-bottom-[15px]"}
        />
        <Animated.View entering={FadeInLeft.easing(Easing.bounce).duration(1000)}>
          <TouchableOpacity onPress={() => router.push('/(root)/client/section/create-transport')} className='bg-indigo-600 gap-2 flex-row py-2 items-center justify-center rounded-xl'>
            <Text className='font-pmedium text-white'>Kërkoni transport</Text>
            <Plus color={"white"}/>
          </TouchableOpacity>
        </Animated.View>

        <Suspense fallback={<View className='h-full bg-gray-50'><LoadingState message='Duke perpunuar te dhenat aktive ne kohe reale te Niso...'/></View>}>
          <PassengerHomeData 
            user={user} 
            onRefetchFunction={(refetch) => setRefetchFunction(() => refetch)}
          />
        </Suspense>
      </View>
    </KeyboardAwareScrollView>
  )
}

export default ClientHome

const PassengerHomeData = ({ user, onRefetchFunction }: {user: User, onRefetchFunction: (refetch: () => Promise<QueryObserverResult>) => void}) => {
  const { data, refetch, isRefetching } = useSuspenseQuery({
    queryKey: ['passengerHomeData'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const res = await api.get<PassengersHomeResponse>('/passengers/passenger-home-data');
      return res.data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Pass the refetch function to the parent
  useEffect(() => {
    onRefetchFunction(refetch);
  }, [refetch, onRefetchFunction]);

  return (
    <>
    {isRefetching ? (
      <View className='h-full bg-gray-50'><LoadingState message='Duke riperpunuar te dhenat aktive te Niso...'/></View>
    ) : (
      <>
      <ActiveTransport user={user} activeRide={data?.userActiveRide}/>
      <ActiveRidesCount count={data?.systemStats?.totalActiveRides}/>
      <HomeActiveDriversWrapper activeDrivers={data?.topAvailableDrivers} onRetry={refetch}/>
      </>
    )}
    </>
  );
};