import { usePulseAnimation } from "@/hooks/usePulseAnimation";
import { Activity, Car } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import Animated, { Easing, FadeIn } from "react-native-reanimated";

type ActiveRidesCountProps = {
  count: number;
};

const ActiveRidesCount = ({ count }: ActiveRidesCountProps) => {
  const pulseStyle = usePulseAnimation({duration: 1000});
  return (
    <Animated.View entering={FadeIn.easing(Easing.linear)} className="bg-white rounded-2xl p-5 shadow-md shadow-black/5 border border-gray-100 items-center justify-center">
      <View className="flex-row items-center mb-2">
        <Car size={28} color="#4F46E5" />
        <Text className="ml-2 text-lg font-psemibold text-indigo-950">
          Transporte Aktive
        </Text>
      </View>

      <Animated.Text style={pulseStyle} className="text-4xl font-pbold text-indigo-600 mb-1">{count}</Animated.Text>

      <View className="flex-row items-center">
        <Activity size={16} color="#10B981" />
        <Text className="ml-1 text-sm text-gray-500">
          Duke u zhvilluar tani
        </Text>
      </View>
    </Animated.View>
  );
};

export default ActiveRidesCount;
