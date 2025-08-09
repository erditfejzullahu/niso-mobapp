import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, FadeInLeft, FadeOutRight } from "react-native-reanimated";

const routesFilterBy = [
    {label: "Krijuar me", icon: <Fontisto name="date" size={20} color="#1e1b4b" />},
    {label: "Urgjenca", icon: <MaterialCommunityIcons name="run-fast" size={20} color="#1e1b4b" />},
    {label: "Distanca", icon: <MaterialCommunityIcons name="map-marker-distance" size={20} color="#1e1b4b" />}
]

const ActiveRoutesFilterComponent = () => {
    const [selectedFilter, setSelectedFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'
    const [fromDate, setFromDate] = useState<null | Date>(null);
    const [toDate, setToDate] = useState<null | Date>(null);
    const [showPicker, setShowPicker] = useState<{show: boolean, target: null | string}>({ show: false, target: null });

    // Date picker change handler
    const onChangeDate = (event: any, selectedDate: any) => {
        setShowPicker({ show: false, target: null });
        if (selectedDate) {
            if (showPicker.target === 'from') setFromDate(selectedDate);
            else if (showPicker.target === 'to') setToDate(selectedDate);
        }
    };

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

            {selectedFilter === "Krijuar me" && (
                <Animated.View exiting={FadeOutRight} entering={FadeInLeft.easing(Easing.in(Easing.ease)).duration(400)} className='p-4 bg-white rounded-xl shadow-[0_5px_10px_rgba(0,0,0,0.1)]'>
                    {/* Sort buttons */}
                    <View className="flex-row justify-center mb-4 gap-4">
                        <TouchableOpacity
                            onPress={() => setSortOrder('latest')}
                            className={`px-4 py-1 rounded-md border flex-row items-center gap-2 ${sortOrder === 'latest' ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
                        >
                            <FontAwesome name="sort-amount-desc" size={16} color={sortOrder === 'latest' ? "white" : "black"} />
                            <Text className={`font-pmedium ${sortOrder === 'latest' ? 'text-white' : 'text-black'}`}>Të fundit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSortOrder('oldest')}
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
                            <Text>Deri: {toDate ? toDate.toLocaleDateString() : "Zgjidh datën"}</Text>
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
                <View className='flex flex-row flex-1 bg-white rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.1)] p-4'>
                    {/* Urgjenca filter UI */}
                    <Text>Urgjenca filter content goes here</Text>
                </View>
            )}

            {selectedFilter === "Distanca" && (
                <View className='flex flex-row flex-1 bg-white rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.1)] p-4'>
                    {/* Distanca filter UI */}
                    <Text>Distanca filter content goes here</Text>
                </View>
            )}
        </Animated.View>
    )
}

export default ActiveRoutesFilterComponent;
