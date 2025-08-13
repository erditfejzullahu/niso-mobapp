import DriverSortFilterComponent, { DriverFilters } from '@/components/client/DriverSortFilterComponent'
import HeaderComponent from '@/components/HeaderComponent'
import React, { useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

const Drivers = () => {
  const [sorter, setSorter] = useState<DriverFilters>({sortBy: "rating", sortOrder: "desc"})

  const handleFiltersChange = useCallback((newFilters: Partial<DriverFilters>) => {
    setSorter((prev) => ({
      ...prev,
      ...newFilters
    }))
  }, [])
  return (
    <KeyboardAwareFlatList 
      contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      data={[]}
      renderItem={({item}) => (
        <View>
          <Text>asd</Text>
        </View>
      )}
      ListHeaderComponent={() => (
        <View className='gap-3'>
          <HeaderComponent 
            subtitle={"Ndërveproni me shoferët e Niso. duke filtruar ndër ta dhe duke kontaktuar me ta"}
            title={<><Text>Shoferët e </Text><Text className='text-indigo-600'>Niso.</Text></>}
          />
          <DriverSortFilterComponent filters={sorter} setFilters={handleFiltersChange}/>
        </View>
      )}
    />
  )
}

export default Drivers