import HeaderComponent from "@/components/HeaderComponent";
import dayjs from "dayjs";
import { CheckCircle, Clock, DollarSign, Euro } from "lucide-react-native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

const financeData = {
  totalEarned: 2580.75,
  completedDrives: 120,
  pendingPayments: 350.5,
  averagePerDrive: 21.5,
  recentPayouts: [
    { id: "1", date: "2025-08-05", amount: 450 },
    { id: "2", date: "2025-07-25", amount: 380 },
    { id: "3", date: "2025-07-10", amount: 600 },
    { id: "4", date: "2025-07-10", amount: 600 },
  ],
};

export default function Statistics() {
  const pulse = useSharedValue(1);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: pulse.value}]
    }
  })

  React.useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.1, {
        duration: 1000, 
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    )
  }, [])

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={financeData.recentPayouts}
        keyExtractor={(item) => item.id}
        className="p-4"
        contentContainerStyle={{paddingBottom: 80}}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="flex-row justify-between bg-white rounded-xl p-4 mb-2 shadow-sm shadow-black/10 border border-gray-100">
            <Text className="text-gray-600 font-pmedium">
              {dayjs(item.date).format("DD MMM YYYY")}
            </Text>
            <Text className="text-indigo-900 font-psemibold">
              {item.amount} €
            </Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View>
              <HeaderComponent title="Financat e tua" style={'!bg-transparent !mb-2 -mt-2'}/>
              {/* Summary cards row */}
              <View className="mb-4 gap-4">
                {/* Total Earned */}
                <View className="bg-white rounded-2xl p-5 shadow-md shadow-black/5 border border-gray-50">
                  <Euro size={28} color="#4338ca" />
                  <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
                    {financeData.totalEarned.toFixed(2)} €
                  </Text>
                  <Text className="text-gray-500 mt-1 font-pmedium">
                    Të ardhurat totale
                  </Text>
                </View>

                {/* Completed Drives */}
                <View className="bg-white rounded-2xl p-5 shadow-md shadow-black/5 border border-gray-50">
                  <CheckCircle size={28} color="#4338ca" />
                  <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
                    {financeData.completedDrives}
                  </Text>
                  <Text className="text-gray-500 mt-1 font-pmedium">
                    Udhëtime të përfunduara
                  </Text>
                </View>
              </View>

              {/* Average earnings + pending payments */}
              <View className="flex-row justify-between mb-6">
                <View className="flex-1 bg-white rounded-2xl p-5 shadow-md shadow-black/5 mr-2 border border-gray-50">
                  <Euro size={28} color="#4338ca" />
                  <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
                    {financeData.averagePerDrive.toFixed(2)} €
                  </Text>
                  <Text className="text-gray-500 mt-1 font-pmedium">
                    Mesatarisht për udhëtim
                  </Text>
                </View>

                <View className="flex-1 bg-white rounded-2xl p-5 shadow-md shadow-black/5 ml-2 border border-gray-50">
                  <Clock size={28} color="#4338ca" />
                  <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
                    {financeData.pendingPayments.toFixed(2)} €
                  </Text>
                  <Text className="text-gray-500 mt-1 font-pmedium">
                    Pagesa në pritje
                  </Text>
                </View>
              </View>

              {/* Recent payouts list */}
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-indigo-900 font-psemibold text-xl">
                  Pagesat e fundit
                </Text>
                <Animated.View style={pulseStyle}>
                  <TouchableOpacity className="shadow-lg shadow-black/5 bg-white p-1 rounded-lg">
                    <DollarSign color={"#312e81"}/>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <Text className="text-center text-gray-400 mt-6">
            Nuk ka pagesa të regjistruara
          </Text>
        )}
      />
    </View>
  );
}
