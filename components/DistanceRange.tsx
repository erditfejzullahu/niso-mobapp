import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

interface DistanceRangeProps {
  minDistance?: number;
  maxDistance?: number;
  initialDistance?: number;
  onDistanceChange?: (distance: number) => void;
  unit?: string;
}

const DistanceRange: React.FC<DistanceRangeProps> = ({
  minDistance = 1,
  maxDistance = 100,
  initialDistance = 10,
  onDistanceChange,
  unit = 'km',
}) => {
  const [distance, setDistance] = useState(initialDistance);

  const handleValueChange = (value: number) => {
    const roundedValue = Math.round(value);
    setDistance(roundedValue);
    if (onDistanceChange) {
      onDistanceChange(roundedValue);
    }
  };

  return (
    <View className="w-full">
      <Text className="text-base font-psemibold mb-2 text-gray-800">
        Zgjidhni distancën e preferuar
      </Text>
      
      <View className="items-center mb-5">
        <Text className="text-lg font-pbold text-indigo-600">
          Deri më {distance} {unit}
        </Text>
      </View>
      
      <Slider
        className="w-full h-10"
        minimumValue={minDistance}
        maximumValue={maxDistance}
        step={1}
        value={distance}
        onValueChange={handleValueChange}
        minimumTrackTintColor="#4f46e5"
        maximumTrackTintColor="#D3D3D3"
        thumbTintColor="#312e81"
      />
      
      <View className="flex-row justify-between mt-1">
        <Text className="text-xs font-plight text-gray-500">{minDistance} {unit}</Text>
        <Text className="text-xs font-plight text-gray-500">{maxDistance} {unit}</Text>
      </View>
    </View>
  );
};

export default DistanceRange;