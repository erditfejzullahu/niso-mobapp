import ActiveDrivers from '@/components/client/ActiveDrivers'
import DriverSortFilterComponent, { DriverFilters } from '@/components/client/DriverSortFilterComponent'
import HeaderComponent from '@/components/HeaderComponent'
import SearchBar from '@/components/SearchBar'
import EmptyState from '@/components/system/EmptyState'
import ErrorState from '@/components/system/ErrorState'
import LoadingState from '@/components/system/LoadingState'
import api from '@/hooks/useApi'
import { PassengerSectionDrivers } from '@/types/app-types'
import { paginationDto } from '@/utils/paginationDto'
import { useQuery } from '@tanstack/react-query'
import dayjs from "dayjs"
import { Tally3, UserStar } from 'lucide-react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

const Drivers = () => {
  const [driversFilter, setDriversFilter] = useState<'all' | 'favorite'>('all')
  const [sorter, setSorter] = useState<DriverFilters>({sortBy: "rating", sortOrder: "desc"})
  const [pagination, setPagination] = useState({...paginationDto})

  const [searchByName, setSearchByName] = useState<{searchParam?: string | null}>({
    searchParam: null
  })

  const {data, isLoading, isRefetching, error, refetch} = useQuery({
    queryKey: ['passenger_drivers_section', sorter, driversFilter, pagination, searchByName],
    queryFn: async () => {
      const params = {
        ...sorter,
        ...pagination,
        ...searchByName
      }
      const res = await api.get<{drivers: PassengerSectionDrivers[]} & {hasMore: boolean}>(`/passengers/passenger-get-drivers?driverFilters=${driversFilter}`, {params: params})
      return res.data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
  })  
  
  const handleFiltersChange = useCallback((newFilters: Partial<DriverFilters>) => {
    setSorter((prev) => ({
      ...prev,
      ...newFilters
    }))
  }, [])

  const searchDrivers = useCallback((data: string) => {
    console.log(data);
    
    if(data === "" || !data){
      setSearchByName({searchParam: null})
    }

    setSearchByName({searchParam: data})
  }, [setSearchByName])

  const ListHeaderComponent = useMemo(() => (
    <View className='gap-3'>
      <HeaderComponent 
        subtitle={"Ndërveproni me shoferët e Niso. duke filtruar ndër ta dhe duke kontaktuar me ta"}
        title={<><Text>Shoferët e </Text><Text className='text-indigo-600'>Niso.</Text></>}
      />
      <DriverSortFilterComponent filters={sorter} setFilters={handleFiltersChange}/>
      <SearchBar placeholder='Kërkoni shoferë' onSearch={searchDrivers}/>
      <View className='flex-row flex-1 rounded-xl bg-white shadow-md shadow-black/5'>
        <TouchableOpacity className='flex-1 border-r border-gray-300 flex-row items-center justify-center my-2 gap-1' onPress={() => setDriversFilter("all")}>
          <Text className={`font-plight text-sm ${driversFilter === "all" && 'text-indigo-600 !font-pmedium'}`}>Te gjithë</Text>
          <Tally3 color={driversFilter === "all" ? "#4f46e5" : "#1e1b4b"} size={16}/>
        </TouchableOpacity>
        <TouchableOpacity className='flex-1 flex-row items-center justify-center gap-1 my-2' onPress={() => setDriversFilter("favorite")}>
          <Text className={`font-plight text-sm ${driversFilter === "favorite" && 'text-indigo-600 !font-pmedium'}`}>Të preferuar</Text>
          <UserStar color={driversFilter === 'favorite' ? "#4f46e5" : "#1e1b4b"} size={16}/>
        </TouchableOpacity>
      </View>
    </View>
  ), [sorter, driversFilter, handleFiltersChange, searchDrivers, setDriversFilter])

  if(isLoading || isRefetching) return (
    <View className='h-full bg-gray-50'><LoadingState /></View>
  )
  if((!isLoading && !isLoading) && error) return (
    <View className='h-full bg-gray-50'><ErrorState onRetry={refetch}/></View> 
  )

  return (
    <KeyboardAwareFlatList 
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={['#4f46e5']}
          tintColor="#4f46e5"
          progressBackgroundColor="#ffffff"
        />
      }
      showsVerticalScrollIndicator={false}
      className='bg-gray-50'
      contentContainerStyle={{ padding: 16, paddingBottom: 80, gap:16 }}
      data={data?.drivers || []}
      renderItem={({item}) => (
        <ActiveDrivers driverActive={item}/>
      )}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={() => (
        <View className=' bg-gray-50'>
          <EmptyState 
            message='Nuk u gjeten te dhena te shofereve te Niso... Nese mendoni qe eshte gabim, provoni perseri duke klikuar butonin e meposhtem.'
            textStyle='!font-plight !text-sm'
            onRetry={refetch}
          />
        </View>
      )}
    />
  )
}

export default Drivers