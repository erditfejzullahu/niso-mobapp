import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/sq';
import { router } from 'expo-router';
import { ArrowLeft, Star, Trash2, X } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import api from '@/hooks/useApi';
import { DriverReviewsInterface, PassengerReviewsInterface, ReviewItem } from '@/types/app-types';
import LoadingState from '@/components/system/LoadingState';
import ErrorState from '@/components/system/ErrorState';
import EmptyState from '@/components/system/EmptyState';
import { paginationDto } from '@/utils/paginationDto';
import { toFixedNoRound } from '@/utils/toFixed';
import { Image } from 'react-native';
import Toast from 'react-native-toast-message';
import PassengerReviewItem from '@/components/client/PassengerReviewItem';

dayjs.locale('sq');

const ReviewsMade = () => {
    
    const [pagination, setPagination] = useState({...paginationDto})

  const {data, isLoading, isRefetching, error, refetch} = useQuery({
      queryKey: ['reviews-made'],
      queryFn: async () => {
          const res = await api.get<PassengerReviewsInterface>('/reviews/get-reviews-passenger', {params: pagination});
          return res.data;
      },
      refetchOnWindowFocus: false,
      retry: 1
  })

  const ListHeaderComponent = useMemo(() => (
    <>
      {/* Overall Rating Summary */}
      <View className="bg-white rounded-2xl p-4 shadow shadow-black/5 mb-4">
        <View className="flex-row items-center">
          <Text className="text-lg font-psemibold text-indigo-950">{data?.reviews.length}</Text>
          <Text className="text-sm text-gray-500 ml-1">vlerësime totale</Text>
        </View>
      </View>
    </>
  ), [data?.reviews.length]);

  const ListFooterComponent = useMemo(() => (
    <View className="pb-6" />
  ), []);

  if(isLoading || isRefetching) return (<View className='h-full bg-gray-50'><LoadingState /></View>);
  if((!isLoading && !isRefetching) && error) return (<View className='h-full bg-gray-50'><ErrorState onRetry={refetch}/></View>);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white rounded-2xl m-4 mb-0 px-4 py-4 shadow shadow-black/5 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3"
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View className='flex-1'>
            <View className='flex-row gap-1'>
                <Text className="text-xl font-psemibold text-indigo-950">Vlerësimet tua</Text>
                <Star color={"#fbbf24"} fill={"#fbbf24"}/>
            </View>
            <Text className='text-xs font-pregular text-gray-700'>Ketu shfaqen te gjithe vleresimet tua ndaj shofereve te Niso. Ndervepro ne rast ndryshim-mendimi.</Text>
        </View>
      </View>

      <FlatList
        refreshControl={
            <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={['#4f46e5']} // Indigo color for iOS
                tintColor="#4f46e5" // iOS spinner color
                progressBackgroundColor="#ffffff" // iOS background
            />
        }
        data={data?.reviews}
        renderItem={({item}) => (<PassengerReviewItem item={item}/>)}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={() => (<View className='h-full bg-gray-50'><EmptyState message='Nuk keni ende vleresime nga pasagjere te Niso. Nese mendoni qe eshte gabim, ju lutem provoni perseri.' textStyle='!font-plight !text-sm' onRetry={refetch}/></View>)}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ReviewsMade;