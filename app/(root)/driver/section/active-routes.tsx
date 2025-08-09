import ActiveRoutesFilterComponent from '@/components/ActiveRoutesFilterComponent'
import HeaderComponent from '@/components/HeaderComponent'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

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
    <View className='gap-4'>
      <HeaderComponent
        title='Udhëtime në pritje'
        subtitle="Këtu mund të kapni udhëtime në kohë reale. Shfrytëzoni filtrat e mëposhtëm për informacione më të specifikuara."
      />
      <ActiveRoutesFilterComponent filters={filters} setFilters={handleFiltersChange} />
    </View>
  );

  return (
    <View className='flex-1'>
      <FlatList
        data={[]}
        className='p-4'
        renderItem={() => <View />}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
}

export default ActiveRoutes;
