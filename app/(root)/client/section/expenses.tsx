import PassengerFinancialItemCard from "@/components/client/PassengerFinancialItemCard";
import FinancialItemCard from "@/components/DriverFinancialItemCard";
import HeaderComponent from "@/components/HeaderComponent";
import EmptyState from "@/components/system/EmptyState";
import ErrorState from "@/components/system/ErrorState";
import LoadingState from "@/components/system/LoadingState";
import api from "@/hooks/useApi";
import { PassengerAllExpensesList, PassengerFinances, PassengerRecentSpents } from "@/types/app-types";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChartColumn, CheckCircle, Clock, CreditCard, Euro, Receipt, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { FlatList, Modal, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export default function ClientExpenses() {
  const [openedAllFinancesModal, setOpenedAllFinancesModal] = useState(false)
  const pulse = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }]
  }));

  React.useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const {data, isLoading, isRefetching, refetch, error} = useQuery({
    queryKey: ['finances'],
    queryFn: async () => {
      const res = await api.get<PassengerFinances>('/finances/passenger-finances');
      return res.data;
    },
    refetchOnWindowFocus: false, 
    retry: 2
  })  


  const {data: allFinancesData, isLoading: allFinancesLoading, isRefetching: allFinancesRefetching, refetch: allFinancesRefetch, error: allFinancesError} = useQuery({
    queryKey: ['allFinancesList'],
    queryFn: async () => {
      const res = await api.get<PassengerAllExpensesList[]>('/finances/all-passenger-finances');
      return res.data;
    },
    refetchOnWindowFocus: false,
    enabled: openedAllFinancesModal,
    retry: 2
  })
  
  console.log(allFinancesData);
  
  const headComp = useMemo(() => (
    <>
      <View className="mb-4">
        <HeaderComponent
          title="Financat e tua" 
          style={'!bg-transparent'} 
          subtitle={"Ketu mund te percillni gjendjen tuaj te financave. Kur keni paguar per udhetim, sa, detaje udhetimi, e shume opsione tjera."}
        />
      </View>
      <View className="mb-4 gap-4">
        {/* Total Spent */}
        <View className="bg-white rounded-2xl p-5 shadow-md shadow-black/5 border border-gray-50">
          <Euro size={28} color="#4338ca" />
          <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
            {data?.totalSpent || 0} €
          </Text>
          <Text className="text-gray-500 mt-1 font-pmedium">
            Shpenzimet totale
          </Text>
        </View>

        {/* Completed Rides */}
        <View className="flex-row justify-between">
          <View className="bg-white flex-1 rounded-2xl p-5 shadow-md shadow-black/5 border border-gray-50 mr-2">
            <CheckCircle size={28} color="#4338ca" />
            <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
              {data?.completedDrives || 0}
            </Text>
            <Text className="text-gray-500 mt-1 font-pmedium">
              Udhëtime të kryera
            </Text>
          </View>
          <View className="bg-white flex-1 rounded-2xl p-5 shadow-md shadow-black/5 border border-gray-50 ml-2">
            <Receipt size={28} color="#4338ca" />
            <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
              {data?.refundedPayments || 0} €
            </Text>
            <Text className="text-gray-500 mt-1 font-pmedium">
              Pagesa të kthyera
            </Text>
          </View>
        </View>
      </View>

      {/* Average + Pending */}
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
          <Clock size={28} color="#4338ca" />
          <Text className="text-3xl font-psemibold mt-3 text-indigo-900">
            {data?.pendingPayments || 0} €
          </Text>
          <Text className="text-gray-500 mt-1 font-pmedium">
            Pagesa në pritje
          </Text>
        </View>
      </View>

      {/* Recent Payments */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-indigo-900 font-psemibold text-xl">
          Pagesat e fundit
        </Text>
        <Animated.View style={pulseStyle}>
          <TouchableOpacity onPress={() => setOpenedAllFinancesModal(true)} className="shadow-lg shadow-black/5 bg-white p-1 rounded-lg">
            <CreditCard color={"#312e81"} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  ), [data?.averagePerDrive, data?.pendingPayments, data?.refundedPayments, data?.completedDrives, data?.totalSpent])

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
        data={data?.recentSpents}
        keyExtractor={(item) => item.id}
        className="p-4"
        contentContainerStyle={{ paddingBottom: 80 }}
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
        ListHeaderComponent={headComp}
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
                className="max-h-[80%]"
                showsVerticalScrollIndicator={false}
                data={allFinancesData}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                  <PassengerFinancialItemCard item={item}/>
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
