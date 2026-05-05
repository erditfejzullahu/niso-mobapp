import ActiveRoutesFilterComponent from '@/components/ActiveRoutesFilterComponent'
import HeaderComponent from '@/components/HeaderComponent'
import RideRequestCard from '@/components/RideRequestCard'
import EmptyState from '@/components/system/EmptyState'
import ErrorState from '@/components/system/ErrorState'
import LoadingState from '@/components/system/LoadingState'
import { useDriverActiveRide } from '@/hooks/driver-rides/useDriverActiveRide'
import api from '@/hooks/useApi'
import { ConnectedRideStatus, DriverConnectedRideHistoryItem, RideRequest } from '@/types/app-types'
import { paginationDto } from '@/utils/paginationDto'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import { FlatList } from 'react-native-gesture-handler'
import { FlatList } from 'react-native'
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated'

// ─── Pinned active ride card ──────────────────────────────────────────────────

function PulseDot() {
  const scale = useSharedValue(1);
  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      false,
    );
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[pinnedStyles.pulseDot, style]} />
  );
}

const ActiveRidePinCard = React.memo(function ActiveRidePinCard({
  ride,
}: {
  ride: DriverConnectedRideHistoryItem;
}) {
  const isDriving = ride.status === ConnectedRideStatus.DRIVING;
  const statusLabel = isDriving ? 'Në rrugë' : 'Duke pritur';
  const statusColor = isDriving ? '#16a34a' : '#d97706';
  const statusBg    = isDriving ? '#dcfce7' : '#fef3c7';

  return (
    <Animated.View entering={FadeInDown.duration(350)}>
      <TouchableOpacity
        activeOpacity={0.84}
        style={pinnedStyles.card}
        onPress={() => router.push(`/(root)/connected-ride/${ride.id}` as any)}
      >
        {/* Top row */}
        <View style={pinnedStyles.topRow}>
          <View style={pinnedStyles.liveRow}>
            <PulseDot />
            <Text style={pinnedStyles.liveText}>Udhëtim aktiv</Text>
          </View>
          <View style={[pinnedStyles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[pinnedStyles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>

        {/* Route */}
        <View style={pinnedStyles.routeContainer}>
          <View style={pinnedStyles.routeRow}>
            <View style={[pinnedStyles.routeDot, { backgroundColor: '#4f46e5' }]} />
            <Text style={pinnedStyles.addressText} numberOfLines={1}>{ride.rideRequest.fromAddress}</Text>
          </View>
          <View style={pinnedStyles.routeLine} />
          <View style={pinnedStyles.routeRow}>
            <View style={[pinnedStyles.routeDot, { backgroundColor: '#dc2626' }]} />
            <Text style={pinnedStyles.addressText} numberOfLines={1}>{ride.rideRequest.toAddress}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={pinnedStyles.footer}>
          <View style={pinnedStyles.passengerRow}>
            <MaterialIcons name="person" size={14} color="#6b7280" />
            <Text style={pinnedStyles.passengerText} numberOfLines={1}>{ride.passenger.fullName}</Text>
          </View>
          <View style={pinnedStyles.rightRow}>
            <Text style={pinnedStyles.priceText}>{ride.rideRequest.price} €</Text>
            <Ionicons name="chevron-forward" size={16} color="#4f46e5" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const pinnedStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' },
  liveText: { fontSize: 12, fontFamily: 'psemibold', color: '#1e1b4b' },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: 'pmedium' },
  routeContainer: { gap: 4, marginBottom: 12 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routeDot: { width: 8, height: 8, borderRadius: 4 },
  routeLine: { width: 1.5, height: 10, backgroundColor: '#d1d5db', marginLeft: 3 },
  addressText: { flex: 1, fontSize: 13, fontFamily: 'pmedium', color: '#1f2937' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  passengerRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  passengerText: { fontSize: 12, fontFamily: 'pregular', color: '#6b7280', flexShrink: 1 },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priceText: { fontSize: 14, fontFamily: 'psemibold', color: '#4f46e5' },
});

// ─── Pinned section header ────────────────────────────────────────────────────

function PinnedSectionHeader() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <Ionicons name="pin" size={13} color="#4f46e5" />
      <Text style={{ fontSize: 11, fontFamily: 'psemibold', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: 0.8 }}>
        Udhëtim i fiksuar
      </Text>
    </View>
  );
}

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

  const { data: activeRide } = useDriverActiveRide();

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
      const {usedFilters, ...apiFilters} = filters;

      const params = {
        ...apiFilters,
        fromDate: apiFilters.fromDate ? apiFilters.fromDate.toISOString() : undefined,
        toDate: apiFilters.toDate ? apiFilters.toDate.toISOString() : undefined,
        distanceRange: apiFilters.distanceRange ?? undefined
      }
      
      return await api.get<RideRequestWithPaginationAndHasMore>('/drivers/available-rides', {params});
    },
    refetchOnWindowFocus: false,
    retry: 2
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
      {activeRide && (
        <View>
          <PinnedSectionHeader />
          <ActiveRidePinCard ride={activeRide} />
        </View>
      )}
      <HeaderComponent
        title='Udhëtime në pritje'
        subtitle="Këtu mund të kapni udhëtime në kohë reale. Shfrytëzoni filtrat e mëposhtëm për informacione më të specifikuara."
      />
      <ActiveRoutesFilterComponent filters={filters} setFilters={handleFiltersChange} />
    </View>
  );  

  if(isLoading || isRefetching) return (<View className='h-full bg-gray-50'><LoadingState /></View>);
  if(!isLoading && error) return (<View className='h-full bg-gray-50'><ErrorState onRetry={refetch}/></View>);

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
        className='p-4 mb-24'
        keyExtractor={(item) => item.id.toString()}
        // contentContainerStyle={{gap: 16}}
        renderItem={({item}) => (
          <RideRequestCard 
            {...item}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<View className='mt-6'><EmptyState textStyle='!font-plight !text-sm' onRetry={refetch} retryButtonText='Rifreskoni kerkesat' message='Nuk ka momentalisht kerkesa te udhetimeve aktive. Nese mendoni qe eshte gabim klikoni butonin me poshte.'/></View>}
      />
    </View>
  );
}

export default ActiveRoutes;
