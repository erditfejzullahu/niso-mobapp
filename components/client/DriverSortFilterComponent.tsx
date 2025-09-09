import { Fontisto } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Star, Users } from 'lucide-react-native';
import React, { memo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { BounceIn, BounceOut, Easing, FadeInLeft, FadeOutRight } from "react-native-reanimated";

export interface DriverFilters {
  sortBy: 'name' | 'rating' | 'createdAt' | null;
  sortOrder: 'asc' | 'desc' | null;
}

interface Props {
  filters: DriverFilters;
  setFilters: (newFilters: Partial<DriverFilters>) => void;
}

const driversFilterBy = [
  { label: "Emri", key: "name", icon: <FontAwesome name="user" size={20} color="#1e1b4b" /> },
  { label: "Vlerësimi", key: "rating", icon: <AntDesign name="star" size={20} color="#1e1b4b" /> },
  { label: "Eksperienca", key: "createdAt", icon: <MaterialCommunityIcons name="calendar" size={20} color="#1e1b4b" /> }
];

const DriverSortFilterComponent = ({ filters, setFilters }: Props) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <View className={`relative ${!showFilters && "py-4"}`}>
      {/* Toggle button */}
      <Animated.View
        className={`absolute top-0 ${showFilters ? "left-0" : "right-0"} z-50`}
        entering={BounceIn}
        exiting={BounceOut}
      >
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          className="rounded-xl shadow-lg shadow-black/15 bg-white p-1"
        >
          <MaterialCommunityIcons name="sort" size={24} color="black" />
        </TouchableOpacity>
      </Animated.View>

      {/* Filter options */}
      {showFilters && (
        <Animated.View
          entering={FadeInLeft.easing(Easing.bounce).duration(800)}
          className="w-full bg-white p-3 py-2 rounded-xl shadow-lg shadow-black/5"
        >
          <View className="flex-row items-center justify-end gap-1 mb-2">
            <MaterialCommunityIcons name="filter" size={24} color="#1e1b4b" />
            <Text className="text-sm font-pregular">Rendit sipas</Text>
          </View>

          <View className="flex flex-row bg-white rounded-xl shadow-[0_5px_10px_rgba(0,0,0,0.1)]">
            {driversFilterBy.map((item, idx) => (
              <TouchableOpacity
                key={item.key}
                onPress={() =>
                  setSelectedFilter(selectedFilter === item.key ? null : item.key)
                }
                className={`flex flex-1 flex-row gap-1 my-2 items-center justify-center ${
                  driversFilterBy.length !== idx + 1 && "border-r border-gray-300"
                }`}
              >
                <Text
                  className={`font-plight text-sm ${
                    selectedFilter === item.key &&
                    "text-indigo-600 !font-pmedium"
                  }`}
                >
                  {item.label}
                </Text>
                {item.icon}
              </TouchableOpacity>
            ))}
          </View>

          {/* Selected filter details */}
          {selectedFilter && (
            <Animated.View
              exiting={FadeOutRight}
              entering={FadeInLeft.easing(Easing.in(Easing.ease)).duration(400)}
              className="p-4 bg-white rounded-xl shadow-lg shadow-black/5 mt-3"
            >
              <View className="flex-row justify-center gap-4">
                {/* Ascending */}
                <TouchableOpacity
                  onPress={() =>
                    setFilters({
                      sortBy: selectedFilter as DriverFilters["sortBy"],
                      sortOrder: "asc",
                    })
                  }
                  className={`px-4 py-1 rounded-md border flex-row items-center gap-2 ${
                    filters.sortBy === selectedFilter &&
                    filters.sortOrder === "asc"
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <FontAwesome
                    name="sort-alpha-asc"
                    size={16}
                    color={
                      filters.sortBy === selectedFilter &&
                      filters.sortOrder === "asc"
                        ? "white"
                        : "black"
                    }
                  />
                  <Text
                    className={`font-pmedium ${
                      filters.sortBy === selectedFilter &&
                      filters.sortOrder === "asc"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    Rritës
                  </Text>
                </TouchableOpacity>

                {/* Descending */}
                <TouchableOpacity
                  onPress={() =>
                    setFilters({
                      sortBy: selectedFilter as DriverFilters["sortBy"],
                      sortOrder: "desc",
                    })
                  }
                  className={`px-4 py-1 rounded-md border flex-row items-center gap-2 ${
                    filters.sortBy === selectedFilter &&
                    filters.sortOrder === "desc"
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <FontAwesome
                    name="sort-alpha-desc"
                    size={16}
                    color={
                      filters.sortBy === selectedFilter &&
                      filters.sortOrder === "desc"
                        ? "white"
                        : "black"
                    }
                  />
                  <Text
                    className={`font-pmedium ${
                      filters.sortBy === selectedFilter &&
                      filters.sortOrder === "desc"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    Zbritës
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}


          {/* Used filters display */}
        {filters.sortBy && (
            <View className='flex-row flex-wrap gap-2 justify-center items-center mt-2'>
            <Text className='text-xs font-pmedium'>Filtrat e perdorur:</Text>
            {filters.sortBy === "createdAt" && (
                <View className='flex-row gap-1 items-center'>
                  <Fontisto name="date" size={16} color="#6366f1" />
                  <Text className='text-indigo-500 text-xs font-pmedium'>Data e krijimit</Text>
                </View>
            )}
            {filters.sortBy === "name" && (
                <View className='flex-row gap-1 items-center'>
                  <Users color={"22c55e"} size={16}/>
                  <Text className='text-green-500 text-xs font-pmedium'>Nga Emri</Text>
                </View>
            )}
            {filters.sortBy === "rating" && (
                <View className='flex-row gap-1 items-center'>
                  <Star color={"#eab308"} size={16}/>
                  <Text className='text-yellow-500 text-xs font-pmedium'>Nga Vleresimi</Text>
                </View>
            )}
            <TouchableOpacity onPress={() => setFilters({sortBy: null, sortOrder: null})}>
                <MaterialCommunityIcons name="close-thick" size={24} color="#1e1b4b" />
            </TouchableOpacity>
            </View>
        )}
        

        </Animated.View>
      )}
    </View>
  );
};

export default memo(DriverSortFilterComponent);
