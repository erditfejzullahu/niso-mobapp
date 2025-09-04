import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/sq';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import api from '@/hooks/useApi';
import { DriverReviewsInterface, ReviewItem } from '@/types/app-types';
import LoadingState from '@/components/system/LoadingState';
import ErrorState from '@/components/system/ErrorState';
import EmptyState from '@/components/system/EmptyState';

dayjs.locale('sq');

// Dummy review data
const dummyReviews = [
  {
    id: 1,
    rating: 5,
    comment: 'Shofer shumë i mirë, udhëtim shumë i këndshëm dhe i sigurt!',
    date: '2024-01-15T10:30:00Z',
    rideFrom: 'Prishtinë, Qendra',
    rideTo: 'Ferizaj, Stacioni',
    rideDate: '2024-01-15T08:00:00Z',
    ridePrice: '15.00€'
  },
  {
    id: 2,
    rating: 4,
    comment: 'Mire, por pak vonoi.',
    date: '2024-01-10T14:20:00Z',
    rideFrom: 'Prizren, Sheshi',
    rideTo: 'Gjilan, Qendra',
    rideDate: '2024-01-10T12:00:00Z',
    ridePrice: '20.00€'
  },
  {
    id: 3,
    rating: 5,
    comment: '',
    date: '2024-01-08T16:45:00Z',
    rideFrom: 'Mitrovicë, Qendra',
    rideTo: 'Pejë, Stacioni',
    rideDate: '2024-01-08T14:30:00Z',
    ridePrice: '25.00€'
  },
  {
    id: 4,
    rating: 3,
    comment: 'Makina pak e vjetër, por shoferi shumë i sjellshëm.',
    date: '2024-01-05T09:15:00Z',
    rideFrom: 'Gjakovë, Sheshi',
    rideTo: 'Prishtinë, Aeroporti',
    rideDate: '2024-01-05T07:00:00Z',
    ridePrice: '30.00€'
  },
  {
    id: 5,
    rating: 5,
    comment: 'Shërbim i shkëlqyer! Do të udhëtoj përsëri me këtë shofer.',
    date: '2024-01-03T19:30:00Z',
    rideFrom: 'Prishtinë, Qendra',
    rideTo: 'Skenderaj, Qendra',
    rideDate: '2024-01-03T17:00:00Z',
    ridePrice: '12.00€'
  }
];

const DriverReviews = () => {

  const {data, isLoading, isRefetching, error, refetch} = useQuery({
      queryKey: ['reviews'],
      queryFn: async () => {
          const res = await api.get<DriverReviewsInterface>('/reviews/get-reviews-driver');
          return res.data;
      },
      refetchOnWindowFocus: false,
      retry: 1
  })

  const renderStars = useMemo(() => (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color={index < rating ? '#fbbf24' : '#d1d5db'}
      />
    ));
  }, []);

  const renderReviewItem = useMemo(() => ({ item }: {item: ReviewItem}) => (
    <View className="bg-white rounded-2xl p-4 shadow shadow-black/5 mb-3 relative">
      {/* Rating and Date */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row">
          {renderStars(item.rating)}
        </View>
        <Text className="text-xs text-gray-500">
          {dayjs(item.createdAt).format('D MMM YYYY')}
        </Text>
      </View>

      {/* Comment */}
      {item.comment && (
        <Text className="text-gray-700 text-sm mb-3 font-pregular">
          "{item.comment}"
        </Text>
      )}

      {/* Ride Details */}
      <View className="border-t border-gray-100 pt-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs text-gray-500">Nga:</Text>
          <Text className="text-xs font-pmedium text-indigo-950">{item.ride.fromAddress}</Text>
        </View>
        
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs text-gray-500">Deri:</Text>
          <Text className="text-xs font-pmedium text-indigo-950">{item.ride.toAddress}</Text>
        </View>
        
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs text-gray-500">Data:</Text>
          <Text className="text-xs font-pmedium text-indigo-950">
            {dayjs(item.ride.updatedAt).format('D MMM YYYY, HH:mm')}
          </Text>
        </View>
        
        <View className="flex-row justify-between items-center ">
          <Text className="text-xs text-gray-500">Çmimi:</Text>
          <Text className="text-xs font-pmedium text-indigo-600">{item.ride.price}</Text>
        </View>

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-xs text-gray-500">Lloji udhetimit:</Text>
          <Text className="text-xs font-pmedium text-red-600">{item.ride.isUrgent ? "Urgjent" : "Normal"}</Text>
        </View>

      </View>
    </View>
  ), [renderStars]);

  const ListHeaderComponent = useMemo(() => (
    <>
      {/* Overall Rating Summary */}
      <View className="bg-white rounded-2xl p-4 shadow shadow-black/5 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-2xl font-psemibold text-indigo-950">{data?.averageRating || 0}</Text>
            <Text className="text-sm text-gray-500">Vlerësim mesatar</Text>
          </View>
          <View className="flex-row">
            {renderStars(Math.round(parseFloat(data?.averageRating || '0')))}          
          </View>
        </View>
        
        <View className="flex-row items-center">
          <Text className="text-lg font-psemibold text-indigo-950">{data?.reviews.length}</Text>
          <Text className="text-sm text-gray-500 ml-1">vlerësime totale</Text>
        </View>
      </View>
    </>
  ), [data?.reviews.length, data?.averageRating]);

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
        <Text className="text-xl font-psemibold text-indigo-950">Vlerësimet e Udhëtimeve</Text>
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
        renderItem={renderReviewItem}
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

export default DriverReviews;