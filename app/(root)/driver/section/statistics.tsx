import HeaderComponent from "@/components/HeaderComponent";
import EmptyState from "@/components/system/EmptyState";
import ErrorState from "@/components/system/ErrorState";
import LoadingState from "@/components/system/LoadingState";
import api from "@/hooks/useApi";
import { DriverAllPayoutsList, DriverFinances } from "@/types/app-types";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChartColumn, ChartColumnIncreasing, CheckCircle, CircleX, Clock, DollarSign, Euro, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { FlatList, Modal, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export default function Statistics() {
  const pulse = useSharedValue(1);
  const [openedAllFinancesModal, setOpenedAllFinancesModal] = useState(false);

  const {data, isLoading, isRefetching, refetch, error} = useQuery({
    queryKey: ['finances'],
    queryFn: async () => {
      const res = await api.get<DriverFinances>('/finances/driver-finances');
      return res.data;
    },
    refetchOnWindowFocus: false, 
  })

  const {data: allFinancesData, isLoading: allFinancesLoading, isRefetching: allFinancesRefetching, refetch: allFinancesRefetch, error: allFinancesError} = useQuery({
    queryKey: ['allFinancesList'],
    queryFn: async () => {
      const res = await api.get<DriverAllPayoutsList[]>('/finances/all-driver-finances');
      return res.data;
    },
    refetchOnWindowFocus: false,
    enabled: openedAllFinancesModal
  })
  

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

  const headerComp = useMemo(() => (
    <View>
      <View className="mb-4">
        <HeaderComponent title="Financat e tua" style={'!bg-transparent'}/>
      </View>
      {/* Summary cards row */}
      <View className="mb-4 gap-4">
        {/* Total Earned */}
        <View className="bg-white rounded-2xl p-5 shadow-md shadow-black/5 border border-gray-50">
          <ChartColumnIncreasing size={28} color="#4338ca" />
          <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
            {data?.totalEarned || 0} €
          </Text>
          <Text className="text-gray-500 mt-1 font-pmedium">
            Të ardhurat totale
          </Text>
        </View>

        {/* Completed Drives */}
        <View className="flex-row justify-between">
          <View className="bg-white mr-2 flex-1 rounded-2xl p-5 shadow-md shadow-black/5 border border-gray-50">
            <CheckCircle size={28} color="#4338ca" />
            <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
              {data?.completedDrives || 0}
            </Text>
            <Text className="text-gray-500 mt-1 font-pmedium">
              Udhëtime të përfunduara
            </Text>
          </View>
          <View className="bg-white ml-2 flex-1 rounded-2xl p-5 shadow-md shadow-black/5 border border-gray-50">
            <Clock size={28} color="#4338ca" />
            <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
              {data?.pendingPayments || 0} €
            </Text>
            <Text className="text-gray-500 mt-1 font-pmedium">
              Pagesa në pritje
            </Text>
          </View>
        </View>
      </View>

      {/* Average earnings + pending payments */}
      <View className="flex-row justify-between mb-6">
        <View className="flex-1 bg-white rounded-2xl p-5 shadow-md shadow-black/5 mr-2 border border-gray-50">
          <ChartColumn size={28} color="#4338ca" />
          <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
            {data?.averagePerDrive || 0} €
          </Text>
          <Text className="text-gray-500 mt-1 font-pmedium">
            Mesatarisht për udhëtim
          </Text>
        </View>

        <View className="flex-1 bg-white rounded-2xl p-5 shadow-md shadow-black/5 ml-2 border border-gray-50">
          <CircleX size={28} color="#4338ca" />
          <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
            {data?.refundedPayments || 0} €
          </Text>
          <Text className="text-gray-500 mt-1 font-pmedium">
            Pagesa te parealizuara
          </Text>
        </View>
      </View>

      {/* Recent payouts list */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-indigo-900 font-psemibold text-xl">
          Pagesat e fundit
        </Text>
        <Animated.View style={pulseStyle}>
          <TouchableOpacity onPress={() => setOpenedAllFinancesModal(true)} className="shadow-lg shadow-black/10 bg-white p-1 rounded-lg">
            <DollarSign color={"#312e81"}/>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  ), [data?.averagePerDrive, data?.completedDrives, data?.pendingPayments, data?.recentPayouts, data?.refundedPayments])

  if(isLoading || isRefetching) return (<View className="h-full bg-gray-50"><LoadingState /></View>);
  if(error) return (<View className="h-full bg-gray-50"><ErrorState onRetry={refetch}/></View>)

  return (
    <>
      <View className="flex-1 bg-gray-50">
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={['#4f46e5']} // Indigo color for iOS
              tintColor="#4f46e5" // iOS spinner color
              progressBackgroundColor="#ffffff" // iOS background
            />
          }
          data={data?.recentPayouts}
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
          ListHeaderComponent={headerComp}
          ListEmptyComponent={() => (
            <View className="bg-gray-50 my-4">
              <EmptyState textStyle='!font-plight !text-sm' message="Nuk ka statistika financore ende. Nese mendoni qe eshte gabim ju lutem provoni perseri." onRetry={refetch}/>
            </View>
          )}
        />
      </View>

      <Modal
        visible={openedAllFinancesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenedAllFinancesModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-5 shadow-lg shadow-black/30">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-psemibold text-indigo-900">Te gjitha fitimet tua</Text>
              <TouchableOpacity onPress={() => setOpenedAllFinancesModal(false)}>
                <X size={22} color="#4338ca" />
              </TouchableOpacity>
            </View>

            {(allFinancesLoading || allFinancesRefetching) ? (
              <View className=" mt-8">
                <LoadingState contStyle="!bg-white"/>
              </View>
            ) : ((!allFinancesLoading && !allFinancesRefetching) && allFinancesError) ? (
              <View className="h-[300px] mt-6">
                <ErrorState contStyle="!bg-white" onRetry={allFinancesRefetch}/>
              </View>
            ) : (
              <FlatList 
                data={allFinancesData}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity>
                    <View className="flex-row justify-between bg-white rounded-xl p-4 mb-2 shadow-sm shadow-black/10 border border-gray-100">
                      <Text className="text-gray-600 font-pmedium">
                        {dayjs(item.paymentDate || item.createdAt).format("DD MMM YYYY")}
                      </Text>
                      <Text className="text-indigo-900 font-psemibold">
                        {item.amount} €
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <View>
                    <EmptyState containerStyle="!bg-white" textStyle="!font-plight !text-sm" message="Nuk u gjeten fitimet tua. Nese mendoni qe eshte gabim provoni perseri." onRetry={allFinancesRefetch}/>
                  </View>
                )}
              />
            )}


            {/* Action Buttons */}
            <View className="justify-end">
              <TouchableOpacity
                onPress={() => setOpenedAllFinancesModal(false)}
                className="px-4 py-3 rounded-xl bg-indigo-600"
              >
                <Text className="text-white font-pmedium text-center">Mbyll</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
