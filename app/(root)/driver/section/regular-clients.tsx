import HeaderComponent from '@/components/HeaderComponent';
import RegularClientCard from '@/components/RegularClientCard';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/system/EmptyState';
import ErrorState from '@/components/system/ErrorState';
import LoadingState from '@/components/system/LoadingState';
import api from '@/hooks/useApi';
import { RegularPassengers } from '@/types/app-types';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { RefreshControl } from 'react-native';
import { FlatList, View } from 'react-native';


const RegularClients = () => {
  const regularClients = [
    {
      id: "1",
      name: "Arben Hoxha",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      ridesCount: 24,
      averageRating: 4.9,
      lastRideDate: "2025-08-08T14:22:00Z",
      mainPickup: "Rruga Dëshmorët e Kombit, Tiranë",
      note: "Preferon sediljen e përparme",
    },
    {
      id: "2",
      name: "Elda Kola",
      photo: "https://randomuser.me/api/portraits/women/45.jpg",
      ridesCount: 15,
      averageRating: 4.8,
      lastRideDate: "2025-08-07T09:45:00Z",
      mainPickup: "Rruga e Elbasanit, Tiranë",
      note: "Paguan gjithmonë në dorë",
    },
    {
      id: "3",
      name: "Gentian Pasha",
      photo: "https://randomuser.me/api/portraits/men/21.jpg",
      ridesCount: 30,
      averageRating: 5.0,
      lastRideDate: "2025-08-06T18:05:00Z",
      mainPickup: "Rruga e Kavajës, Tiranë",
    },
  ];

  const [searchParam, setSearchParam] = useState("")

  const {data, isLoading, isRefetching, error, refetch} = useQuery({
    queryKey: ['regularPassengers', searchParam],
    queryFn: async () => {
      console.log('///');
      
      return await api.get<RegularPassengers[]>(`/drivers/regular-clients`, {params: searchParam})
    },
    refetchOnWindowFocus: false
  })
  

  if(isLoading || isRefetching) return <LoadingState />;
  if(!isLoading && error) return <ErrorState onRetry={refetch}/>
  

  return (
    <View className='flex-1 bg-gray-50'>
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
        showsVerticalScrollIndicator={false}
        data={data?.data}
        className='p-4 mb-20'
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <RegularClientCard 
            name={item.fullName}
            photo={item.image}
            ridesCount={item.ridesWithDriver}
            lastRideDate={new Date().toString()}
            mainPickup={item.userInformation.address}
            note={item.userInformation.yourDesiresForRide}
          />
        )}
        ListHeaderComponent={() => (
          <View className='mb-4'>
            <HeaderComponent
              title='Klientë të rregullt'
              subtitle="Këtu keni listën e klientëve të rregullt me të cilët mund të kontaktoni rregullisht"
            />
            <View className='mt-4'>
              <SearchBar onSearch={(e) => setSearchParam(e)}/>
            </View>
          </View>
        )}
        ListEmptyComponent={<View className='items-center justify-center h-full mt-6'><EmptyState message='Nuk u gjeten klient te rregullt.' onRetry={refetch}  retryButtonText='Provoni perseri'/></View>}
      />
    </View>
  )
}

export default RegularClients