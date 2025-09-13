import { Filters } from '@/app/(root)/driver/section/active-routes';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import Animated, { BounceIn, BounceOut, Easing, FadeInLeft, FadeOutRight } from "react-native-reanimated";
import DistanceRange from './DistanceRange';

const routesFilterBy = [
  { label: "Krijuar me", icon: <Fontisto name="date" size={20} color="#1e1b4b" /> },
  { label: "Urgjenca", icon: <MaterialCommunityIcons name="run-fast" size={20} color="#1e1b4b" /> },
  { label: "Distanca", icon: <MaterialCommunityIcons name="map-marker-distance" size={20} color="#1e1b4b" /> }
];

interface Props {
  filters: Filters;
  setFilters: (newFilters: Partial<Filters>) => void;
}

const ActiveRoutesFilterComponent = ({ filters, setFilters }: Props) => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showPicker, setShowPicker] = useState<{ show: boolean; target: null | string }>({ show: false, target: null });

    const [showFilters, setShowFilters] = useState(true);
  const onChangeDate = (event: any, selectedDate: any) => {
    if (selectedDate) {
      if (showPicker.target === 'from') {
        setFilters({
          fromDate: selectedDate,
          usedFilters: { ...filters.usedFilters, fromDate: true, showFilter: true }
        });
      } else if (showPicker.target === 'to') {
        setFilters({
          toDate: selectedDate,
          usedFilters: { ...filters.usedFilters, toDate: true, showFilter: true }
        });
      }
    }
    setShowPicker({ show: false, target: null });
  };

  const handleResetFilters = () => {
    setFilters({
      sortOrder: 'latest',
      fromDate: null,
      toDate: null,
      urgencyType: 'normal',
      distanceRange: null,
      usedFilters: { sortDate: false, fromDate: false, toDate: false, urgency: false, distance: false, showFilter: false }
    });
  };

  const handleDistanceChange = useCallback(
    debounce((distance: number) => {
        setFilters({
        distanceRange: distance,
        usedFilters: { ...filters.usedFilters, distance: true, showFilter: true }
        });
    }, 800), // delay in ms
    [filters.usedFilters, setFilters]
    );

  return (
    <>
    <View className={`relative ${!showFilters && "py-4"}`}>
        {!showFilters && <Animated.View className={`absolute top-0 ${!showFilters && "right-0"} z-50`} entering={BounceIn} exiting={BounceOut}>
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)} className='rounded-xl shadow-lg shadow-black/15 bg-white p-1'>
                <MaterialCommunityIcons name="image-filter-vintage" size={24} color="black" />
            </TouchableOpacity>
        </Animated.View>}
        {showFilters && <Animated.View className={`absolute top-0 ${showFilters && "left-0"} z-50`} entering={BounceIn} exiting={BounceOut}>
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)} className='rounded-xl shadow-lg shadow-black/15 bg-white p-1'>
                <MaterialCommunityIcons name="image-filter-vintage" size={24} color="black" />
            </TouchableOpacity>
        </Animated.View>}


        {showFilters && <Animated.View entering={FadeInLeft.easing(Easing.bounce).duration(1000)} className={`w-full bg-white p-3 py-2 ${selectedFilter ? "pb-3" : "pb-1"} rounded-xl shadow-lg shadow-black/5`}>
        <View className='flex-row items-center justify-end gap-1'>
            <MaterialCommunityIcons name="filter" size={24} color="#1e1b4b" />
            <Text className='text-sm font-pregular text-right'>Filtro nga opsionet e meposhtme</Text>
        </View>

        {/* Filter buttons */}
        <View className='flex flex-row flex-1 bg-white rounded-xl shadow-[0_5px_10px_rgba(0,0,0,0.1)] mt-2 mb-4'>
            {routesFilterBy.map((item, idx) => (
            <TouchableOpacity
                key={item.label}
                onPress={() => setSelectedFilter(selectedFilter === item.label ? "" : item.label)}
                className={`flex flex-1 flex-row gap-1 my-2 items-center justify-center ${routesFilterBy.length !== idx + 1 && "border-r border-gray-300"}`}
            >
                <Text className={`font-plight text-sm ${selectedFilter === item.label && "text-indigo-600 !font-pmedium"}`}>{item.label}</Text>
                {item.icon}
            </TouchableOpacity>
            ))}
        </View>

        {/* Used filters display */}
        {filters.usedFilters.showFilter && (
            <View className='mb-3 flex-row flex-wrap gap-2 justify-center items-center'>
            <Text className='text-xs font-pmedium'>Filtrat e perdorur:</Text>
            {filters.usedFilters.sortDate && (
                <View className='flex-row gap-1 items-center'>
                <Fontisto name="date" size={16} color="#6366f1" />
                <Text className='text-indigo-500 text-xs font-pmedium'>Data e krijimit</Text>
                </View>
            )}
            {(filters.usedFilters.fromDate || filters.usedFilters.toDate) && (
                <View className='flex-row gap-1 items-center'>
                <MaterialCommunityIcons name="clock-time-eight-outline" size={16} color="#ef4444" />
                <Text className='text-red-500 text-xs font-pmedium'>Data e specifikuar</Text>
                </View>
            )}
            {filters.usedFilters.urgency && (
                <View className='flex-row gap-1 items-center'>
                <MaterialCommunityIcons name="run-fast" size={16} color="#22c55e" />
                <Text className='text-green-500 text-xs font-pmedium'>Nga urgjenca</Text>
                </View>
            )}
            {filters.usedFilters.distance && (
                <View className='flex-row gap-1 items-center'>
                <MaterialCommunityIcons name="map-marker-distance" size={16} color="#06b6d4" />
                <Text className='text-cyan-500 text-xs font-pmedium'>Nga distanca</Text>
                </View>
            )}
            <TouchableOpacity onPress={handleResetFilters}>
                <MaterialCommunityIcons name="close-thick" size={24} color="#1e1b4b" />
            </TouchableOpacity>
            </View>
        )}

        {/* "Krijuar me" filter */}
        {selectedFilter === "Krijuar me" && (
            <Animated.View exiting={FadeOutRight} entering={FadeInLeft.easing(Easing.in(Easing.ease)).duration(400)} className='p-4 bg-white rounded-xl shadow-lg shadow-black/5'>
            <View className="flex-row justify-center mb-4 gap-4">
                <TouchableOpacity
                onPress={() => setFilters({ sortOrder: 'latest', usedFilters: { ...filters.usedFilters, sortDate: true, showFilter: true } })}
                className={`px-4 py-1 rounded-md border flex-row items-center gap-2 ${filters.sortOrder === 'latest' ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
                >
                <FontAwesome name="sort-amount-desc" size={16} color={filters.sortOrder === 'latest' ? "white" : "black"} />
                <Text className={`font-pmedium ${filters.sortOrder === 'latest' ? 'text-white' : 'text-black'}`}>Të fundit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => setFilters({ sortOrder: 'oldest', usedFilters: { ...filters.usedFilters, sortDate: true, showFilter: true } })}
                className={`px-4 py-1 rounded-md flex-row items-center gap-2 border ${filters.sortOrder === 'oldest' ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
                >
                <FontAwesome name="sort-amount-asc" size={16} color={filters.sortOrder === 'oldest' ? "white" : "black"} />
                <Text className={`font-pmedium ${filters.sortOrder === 'oldest' ? 'text-white' : 'text-black'}`}>Të vjetrat</Text>
                </TouchableOpacity>
            </View>

            {/* Date pickers */}
            <View className="gap-4">
                <TouchableOpacity
                onPress={() => setShowPicker(showPicker.show && showPicker.target === "from" ? { show: false, target: null } : { show: true, target: 'from' })}
                className="flex-1 p-3 border border-gray-100 rounded-lg shadow-md shadow-black/15 bg-white"
                >
                <Text>Nga: {filters.fromDate ? filters.fromDate.toLocaleString('sq-AL', { dateStyle: "medium", timeStyle: "medium" }) : "Zgjidh datën"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => setShowPicker(showPicker.show && showPicker.target === "to" ? { show: false, target: null } : { show: true, target: 'to' })}
                className="flex-1 p-3 border border-gray-100 rounded-lg shadow-md shadow-black/15 bg-white"
                >
                <Text>Deri: {filters.toDate ? filters.toDate.toLocaleString('sq-AL', { dateStyle: "medium", timeStyle: "medium" }) : "Zgjidh datën"}</Text>
                </TouchableOpacity>
            </View>

            {showPicker.show && (
                <>
                <Text className='text-xs font-plight text-indigo-600 mt-4'>
                    {showPicker.target === "from" ? "Zgjidhni datën nga një kohë e caktuar" : "Zgjidhni datën deri në nje kohë të caktuar"}
                </Text>
                <DateTimePicker
                    locale='sq-AL'
                    value={showPicker.target === 'from' ? (filters.fromDate || new Date()) : (filters.toDate || new Date())}
                    mode="datetime"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChangeDate}
                    maximumDate={new Date()}
                />
                </>
            )}
            </Animated.View>
        )}

        {/* "Urgjenca" filter */}
        {selectedFilter === "Urgjenca" && (
            <Animated.View exiting={FadeOutRight} entering={FadeInLeft.easing(Easing.in(Easing.ease)).duration(400)} className='p-4 bg-white rounded-xl shadow-lg shadow-black/5'>
            <View className="justify-center flex-1 gap-2">
                <TouchableOpacity
                onPress={() => setFilters({ urgencyType: "urgent", usedFilters: { ...filters.usedFilters, urgency: true, showFilter: true } })}
                className={`px-4 py-2 w-full rounded-md border flex-row items-center gap-2 ${filters.urgencyType === "urgent" ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
                >
                <MaterialCommunityIcons name="run-fast" size={16} color={filters.urgencyType === 'urgent' ? "white" : "black"} />
                <Text className={`font-pmedium ${filters.urgencyType === 'urgent' ? 'text-white' : 'text-black'}`}>Kërkesa urgjente</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => setFilters({ urgencyType: "normal", usedFilters: { ...filters.usedFilters, urgency: true, showFilter: true } })}
                className={`px-4 py-2 w-full rounded-md border flex-row items-center gap-2 ${filters.urgencyType === "normal" ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
                >
                <MaterialCommunityIcons name="walk" size={16} color={filters.urgencyType === 'normal' ? "white" : "black"} />
                <Text className={`font-pmedium ${filters.urgencyType === 'normal' ? 'text-white' : 'text-black'}`}>Kërkesa normale</Text>
                </TouchableOpacity>
            </View>
            </Animated.View>
        )}

        {/* "Distanca" filter */}
        {selectedFilter === "Distanca" && (
            <Animated.View exiting={FadeOutRight} entering={FadeInLeft.easing(Easing.in(Easing.ease)).duration(400)} className='p-4 bg-white rounded-xl shadow-lg shadow-black/5'>
            <DistanceRange
                minDistance={1}
                maxDistance={200}
                initialDistance={filters.distanceRange || undefined}
                onDistanceChange={handleDistanceChange}
                unit='km'
            />
            </Animated.View>
        )}
        </Animated.View>}
    </View>
    </>
  );
};

export default ActiveRoutesFilterComponent;
