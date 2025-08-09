import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, FadeInLeft, FadeOutRight } from "react-native-reanimated";
import DistanceRange from './DistanceRange';

const routesFilterBy = [
    {label: "Krijuar me", icon: <Fontisto name="date" size={20} color="#1e1b4b" />},
    {label: "Urgjenca", icon: <MaterialCommunityIcons name="run-fast" size={20} color="#1e1b4b" />},
    {label: "Distanca", icon: <MaterialCommunityIcons name="map-marker-distance" size={20} color="#1e1b4b" />}
]

const ActiveRoutesFilterComponent = () => {
    const [selectedFilter, setSelectedFilter] = useState('');
    const [sortOrder, setSortOrder] = useState<'oldest' | 'latest'>('latest'); // 'latest' or 'oldest'
    const [fromDate, setFromDate] = useState<null | Date>(null);
    const [toDate, setToDate] = useState<null | Date>(null);
    const [urgencyType, setUrgencyType] = useState<'urgent' | 'normal'>('normal')
    const [showPicker, setShowPicker] = useState<{show: boolean, target: null | string}>({ show: false, target: null });

    const [usedFilters, setUsedFilters] = useState({
        sortDate: false,
        fromDate: false,
        toDate: false,
        urgency: false,
        distance: false,
        showFilter: false
    })

    // Date picker change handler
    const onChangeDate = (event: any, selectedDate: any) => {
        if (selectedDate) {
            if (showPicker.target === 'from') setFromDate(selectedDate), setUsedFilters((prev) => ({...prev, fromDate: true, showFilter: true}));
            else if (showPicker.target === 'to') setToDate(selectedDate), setUsedFilters((prev) => ({...prev, toDate: true, showFilter: true}));
        }
        setShowPicker({ show: false, target: null });
    };

    const handleResetFilters = () => {
        setUsedFilters({sortDate: false, fromDate: false, toDate: false, urgency: false, distance: false, showFilter: false})
        setSortOrder('latest')
        setFromDate(null)
        setToDate(null)
        setShowPicker({show: false, target: null})
    }

    const handleDistanceChange = (distance: number) => {
        console.log(distance)
    }

    return (
        <Animated.View entering={FadeInLeft.easing(Easing.bounce).duration(1000)} className={`w-full bg-white p-3 py-2 ${selectedFilter ? "pb-3" : "pb-1"} rounded-xl shadow-lg shadow-black/5`}>
            <View className='flex-row items-center justify-end gap-1'>
                <MaterialCommunityIcons name="filter" size={24} color="#1e1b4b" />
                <Text className='text-sm font-pregular text-right'>Filtro nga opsionet e meposhtme</Text>
            </View>
            <View className='flex flex-row flex-1 bg-white rounded-xl shadow-[0_5px_10px_rgba(0,0,0,0.1)] mt-2 mb-4'>
                {routesFilterBy.map((item, idx) => (
                    <TouchableOpacity
                        key={item.label}
                        onPress={() => selectedFilter === item.label ? setSelectedFilter("") : setSelectedFilter(item.label)}
                        className={`flex flex-1 flex-row gap-1 my-2 items-center justify-center ${routesFilterBy.length !== idx + 1 && "border-r border-gray-300"}`}
                    >
                        <Text className={`font-plight text-sm ${selectedFilter === item.label && "text-indigo-600 !font-pmedium"}`}>{item.label}</Text>
                        {item.icon}
                    </TouchableOpacity>
                ))}
            </View>

            {usedFilters.showFilter && <View className='mb-3 flex-row flex-wrap gap-2 justify-center items-center'>
                <Text className='text-xs font-pmedium'>Filtrat e perdorur:</Text>
                {usedFilters.sortDate && <View className='flex-row gap-1 items-center'>
                    <Fontisto name="date" size={16} color="#6366f1" />
                    <Text className='text-indigo-500 text-xs font-pmedium'>Data e krijimit</Text>
                </View>}
                {(usedFilters.fromDate || usedFilters.toDate) && <View className='flex-row gap-1 items-center'>
                    <MaterialCommunityIcons name="clock-time-eight-outline" size={16} color="#ef4444" />
                    <Text className='text-red-500 text-xs font-pmedium'>Data e specifikuar</Text>
                </View>}
                {usedFilters.urgency && <View className='flex-row gap-1 items-center'>
                    <MaterialCommunityIcons name="run-fast" size={16} color="#22c55e" />
                    <Text className='text-green-500 text-xs font-pmedium'>Nga urgjenca</Text>
                </View>}
                {usedFilters.distance && <View className='flex-row gap-1 items-center'>
                    <MaterialCommunityIcons name="map-marker-distance" size={16} color="#06b6d4" />
                    <Text className='text-cyan-500 text-xs font-pmedium'>Nga distanca</Text>
                </View>}
                <TouchableOpacity onPress={handleResetFilters}>
                    <MaterialCommunityIcons name="close-thick" size={24} color="#1e1b4b" />
                </TouchableOpacity>
            </View>}

            {selectedFilter === "Krijuar me" && (
                <Animated.View exiting={FadeOutRight} entering={FadeInLeft.easing(Easing.in(Easing.ease)).duration(400)} className='p-4 bg-white rounded-xl shadow-[0_5px_10px_rgba(0,0,0,0.1)]'>
                    {/* Sort buttons */}
                    <View className="flex-row justify-center mb-4 gap-4">
                        <TouchableOpacity
                            onPress={() => {setSortOrder('latest'); setUsedFilters((prev) => ({...prev, sortDate: true, showFilter: true}))}}
                            className={`px-4 py-1 rounded-md border flex-row items-center gap-2 ${sortOrder === 'latest' ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
                        >
                            <FontAwesome name="sort-amount-desc" size={16} color={sortOrder === 'latest' ? "white" : "black"} />
                            <Text className={`font-pmedium ${sortOrder === 'latest' ? 'text-white' : 'text-black'}`}>Të fundit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {setSortOrder('oldest'); setUsedFilters((prev) => ({...prev, sortDate: true, showFilter: true}))}}
                            className={`px-4 py-1 rounded-md flex-row items-center gap-2 border  ${sortOrder === 'oldest' ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
                        >
                            <FontAwesome name="sort-amount-asc" size={16} color={sortOrder === 'oldest' ? "white" :"black"} />
                            <Text className={`font-pmedium ${sortOrder === 'oldest' ? 'text-white' : 'text-black'}`}>Të vjetrat</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Date selectors */}
                    <View className="gap-4">
                        <TouchableOpacity
                            onPress={() => showPicker.show && showPicker.target === "from" ? setShowPicker({show: false, target: null}) : setShowPicker({ show: true, target: 'from' })}
                            className="flex-1 p-3  border border-gray-100 rounded-lg shadow-md shadow-black/15 bg-white"
                        >
                            <Text>Nga: {fromDate ? fromDate.toLocaleString('sq-AL', {dateStyle: "medium", timeStyle: "medium"}) : "Zgjidh datën"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => showPicker.show && showPicker.target === "to" ? setShowPicker({show: false, target: null}) : setShowPicker({ show: true, target: 'to' })}
                            className="flex-1 p-3 border border-gray-100 rounded-lg shadow-md shadow-black/15 bg-white"
                        >
                            <Text>Deri: {toDate ? toDate.toLocaleString('sq-AL', {dateStyle: "medium", timeStyle: "medium"}) : "Zgjidh datën"}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Show date picker */}
                    {showPicker.show && (
                        <>
                        <Text className='text-xs font-plight text-indigo-600 mt-4'>{showPicker.target === "from" ? "Zgjidhni datën nga një kohë e caktuar" : "Zgjidhni datën deri në nje kohë të caktuar"}</Text>
                            <DateTimePicker
                                value={showPicker.target === 'from' ? (fromDate || new Date()) : (toDate || new Date())}
                                mode={"datetime"}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onChangeDate}
                                maximumDate={new Date()} // optional: don't allow future dates
                            />
                        </>
                    )}
                </Animated.View>
            )}

            {/* You can fill the other filters here as you want */}
            {selectedFilter === "Urgjenca" && (
                <Animated.View exiting={FadeOutRight} entering={FadeInLeft.easing(Easing.in(Easing.ease)).duration(400)} className='p-4 bg-white rounded-xl shadow-[0_5px_10px_rgba(0,0,0,0.1)]'>
                    {/* Urgjenca filter UI */}
                    <View className="justify-center flex-1 gap-2">
                        <TouchableOpacity
                            onPress={() => {setUrgencyType("urgent"); setUsedFilters((prev) => ({...prev, urgency: true, showFilter: true}))}}
                            className={`px-4 py-2 w-full justify-center rounded-md border flex-row items-center gap-2 ${urgencyType === "urgent" ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
                        >
                            <MaterialCommunityIcons name="run-fast" size={16} color={urgencyType === 'urgent' ? "white" :"black"} />
                            <Text className={`font-pmedium ${urgencyType === 'urgent' ? 'text-white' : 'text-black'}`}>Kërkesa urgjente</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {setUrgencyType("normal"); setUsedFilters((prev) => ({...prev, urgency: true, showFilter: true}))}}
                            className={`px-4 w-full py-2 justify-center rounded-md flex-row items-center gap-2 border  ${urgencyType === "normal" ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
                        >
                            <MaterialCommunityIcons name="walk" size={16} color={urgencyType === 'normal' ? "white" :"black"} />
                            <Text className={`font-pmedium ${urgencyType === 'normal' ? 'text-white' : 'text-black'}`}>Kërkesa normale</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

            {selectedFilter === "Distanca" && (
                <Animated.View exiting={FadeOutRight} entering={FadeInLeft.easing(Easing.in(Easing.ease)).duration(400)} className='p-4 bg-white rounded-xl shadow-[0_5px_10px_rgba(0,0,0,0.1)]'>
                    {/* Distanca filter UI */}
                    <DistanceRange 
                        minDistance={1}
                        maxDistance={200}
                        initialDistance={50}
                        onDistanceChange={handleDistanceChange}
                        unit='km'
                    />
                </Animated.View>
            )}
        </Animated.View>
    )
}

export default ActiveRoutesFilterComponent;
