import ActiveRoutesFilterComponent from '@/components/ActiveRoutesFilterComponent'
import HeaderComponent from '@/components/HeaderComponent'
import RideRequestCard from '@/components/RideRequestCard'
import EmptyState from '@/components/system/EmptyState'
import ErrorState from '@/components/system/ErrorState'
import LoadingState from '@/components/system/LoadingState'
import api from '@/hooks/useApi'
import { RideRequest } from '@/types/app-types'
import { paginationDto } from '@/utils/paginationDto'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useState } from 'react'
import { RefreshControl, View } from 'react-native'
// import { FlatList } from 'react-native-gesture-handler'
import { FlatList } from 'react-native'

export const rideRequests = [
  {
    id: 1,
    clientName: "Arben Hoxha",
    clientPhoto: "https://randomuser.me/api/portraits/men/32.jpg",
    from: "Rruga Dëshmorët e Kombit, Tiranë",
    to: "Sheshi Skënderbej, Tiranë",
    price: 8,
    urgent: true,
    dateCreated: "2025-08-09T14:22:00Z",
    distanceKm: 3.2,
  },
  {
    id: 2,
    clientName: "Elda Kola",
    clientPhoto: "https://randomuser.me/api/portraits/women/45.jpg",
    from: "Rruga e Elbasanit, Tiranë",
    to: "Durres Beach, Durrës",
    price: null,
    urgent: false,
    dateCreated: "2025-08-09T10:15:00Z",
    distanceKm: 37.8,
  },
  {
    id: 3,
    clientName: "Gentian Pasha",
    clientPhoto: "https://randomuser.me/api/portraits/men/21.jpg",
    from: "Rruga e Kavajës, Tiranë",
    to: "Berat Castle, Berat",
    price: 35,
    urgent: false,
    dateCreated: "2025-08-08T18:05:00Z",
    distanceKm: 120,
  },
  {
    id: 4,
    clientName: "Arta Dervishi",
    clientPhoto: "https://randomuser.me/api/portraits/women/12.jpg",
    from: "Airport Nënë Tereza, Rinas",
    to: "Sheshi Skënderbej, Tiranë",
    price: 15,
    urgent: true,
    dateCreated: "2025-08-09T07:45:00Z",
    distanceKm: 17.5,
  },
];


export interface Filters {
  sortOrder: 'oldest' | 'latest';
  fromDate: Date | null;
  toDate: Date | null;
  urgencyType: 'urgent' | 'normal';
  distanceRange: number | null;
  usedFilters: {
    sortDate: boolean;
    fromDate: boolean;
    toDate: boolean;
    urgency: boolean;
    distance: boolean;
    showFilter: boolean;
  };
}

type RideRequestWithPaginationAndHasMore = {
  rides: RideRequest[],
  hasMore: boolean
}

const ActiveRoutes = () => {

  const [pagination, setPagination] = useState(paginationDto)

  const [filters, setFilters] = useState<Filters>({
    sortOrder: 'latest',
    fromDate: null,
    toDate: null,
    urgencyType: 'normal',
    distanceRange: null,
    usedFilters: {
      sortDate: false,
      fromDate: false,
      toDate: false,
      urgency: false,
      distance: false,
      showFilter: false
    }
  });

  const {data, isLoading, isRefetching, refetch, error} = useQuery({
    queryKey: ['availableRides', filters, pagination],
    queryFn: async () => {
      return await api.get<RideRequestWithPaginationAndHasMore>('/drivers/available-rides', {params: filters});
    }
  })

  const handleFiltersChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const loadMore = () => {
    if(!isLoading && data?.data.hasMore){
      setPagination((prev) => ({...prev, page: prev.page + 1}))
    }
  }

  const renderHeader = () => (
    <View className='gap-4 mb-4'>
      <HeaderComponent
        title='Udhëtime në pritje'
        subtitle="Këtu mund të kapni udhëtime në kohë reale. Shfrytëzoni filtrat e mëposhtëm për informacione më të specifikuara."
      />
      <ActiveRoutesFilterComponent filters={filters} setFilters={handleFiltersChange} />
    </View>
  );

  

  if(isLoading || isRefetching) return (<LoadingState />);
  if(!isLoading && error) return (<ErrorState onRetry={refetch}/>);

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
        data={data?.data.rides}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        className='p-4 mb-20'
        keyExtractor={(item) => item.id.toString()}
        // contentContainerStyle={{gap: 16}}
        renderItem={({item}) => (
          <RideRequestCard 
            {...item}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<View><EmptyState textStyle='!font-plight !text-sm' onRetry={refetch} retryButtonText='Rifreskoni kerkesat' message='Nuk ka momentalisht kerkesa te udhetimeve aktive. Nese mendoni qe eshte gabim klikoni butonin me poshte.'/></View>}
      />
    </View>
  );
}

export default ActiveRoutes;
