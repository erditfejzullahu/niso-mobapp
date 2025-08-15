import ActiveDrivers from '@/components/client/ActiveDrivers'
import DriverSortFilterComponent, { DriverFilters } from '@/components/client/DriverSortFilterComponent'
import HeaderComponent from '@/components/HeaderComponent'
import SearchBar from '@/components/SearchBar'
import dayjs from "dayjs"
import { Tally3, UserStar } from 'lucide-react-native'
import React, { useCallback, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'


const Drivers = () => {
  const [driversFilter, setDriversFilter] = useState<'all' | 'favorite'>('all')
  const [sorter, setSorter] = useState<DriverFilters>({sortBy: "rating", sortOrder: "desc"})
  const dummyActiveDrivers = [
  {
    id: 1,
    name: "Ardit Leka",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4.7,
    car: {
      brand: "Mercedes",
      model: "E-Class",
      plate: "TR-456-AB",
    },
    registeredAt: dayjs().subtract(8, "month").toISOString(),
    onDuty: true,
  },
  {
    id: 2,
    name: "Eriona Krasniqi",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    car: {
      brand: "BMW",
      model: "X5",
      plate: "AA-789-CC",
    },
    registeredAt: dayjs().subtract(1, "year").toISOString(),
    onDuty: true,
  },
  {
    id: 3,
    name: "Blerim Dervishi",
    photo: "https://randomuser.me/api/portraits/men/53.jpg",
    rating: 4.3,
    car: {
      brand: "Audi",
      model: "A4",
      plate: "DR-654-DF",
    },
    registeredAt: dayjs().subtract(2, "year").toISOString(),
    onDuty: false,
  },
  ];
  const handleFiltersChange = useCallback((newFilters: Partial<DriverFilters>) => {
    setSorter((prev) => ({
      ...prev,
      ...newFilters
    }))
  }, [])

  const searchDrivers = useCallback((data: string) => {

  }, [])

  return (
    <KeyboardAwareFlatList 
      className='bg-gray-50'
      contentContainerStyle={{ padding: 16, paddingBottom: 80, gap:16 }}
      data={dummyActiveDrivers}
      renderItem={({item}) => (
        <ActiveDrivers driverActive={item}/>
      )}
      ListHeaderComponent={() => (
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
      )}
    />
  )
}

export default Drivers