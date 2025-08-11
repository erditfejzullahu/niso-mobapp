import ActiveRoutesFilterComponent from '@/components/ActiveRoutesFilterComponent'
import HeaderComponent from '@/components/HeaderComponent'
import RideRequestCard from '@/components/RideRequestCard'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
// import { FlatList } from 'react-native-gesture-handler'
import { FlatList } from 'react-native'

export const rideRequests = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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

const ActiveRoutes = () => {
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

  const handleFiltersChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const renderHeader = () => (
    <View className='gap-4 mb-4'>
      <HeaderComponent
        title='Udhëtime në pritje'
        subtitle="Këtu mund të kapni udhëtime në kohë reale. Shfrytëzoni filtrat e mëposhtëm për informacione më të specifikuara."
      />
      <ActiveRoutesFilterComponent filters={filters} setFilters={handleFiltersChange} />
    </View>
  );

  return (
    <View className='flex-1 bg-gray-50'>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={rideRequests}
        className='p-4 mb-20'
        keyExtractor={(item) => item.id}
        // contentContainerStyle={{gap: 16}}
        renderItem={({item}) => (
          <RideRequestCard 
            clientName={item.clientName}
            clientPhoto={item.clientPhoto}
            from={item.from}
            to={item.to}
            price={item.price}
            urgent={item.urgent}
            dateCreated={item.dateCreated}
            distanceKm={item.distanceKm}
          />
        )}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
}

export default ActiveRoutes;
