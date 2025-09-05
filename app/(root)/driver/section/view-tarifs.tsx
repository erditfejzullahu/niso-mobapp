import HeaderComponent from "@/components/HeaderComponent";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/system/EmptyState";
import ErrorState from "@/components/system/ErrorState";
import LoadingState from "@/components/system/LoadingState";
import api from "@/hooks/useApi";
import { DriverFixedTarifs } from "@/types/app-types";
import { toFixedNoRound } from "@/utils/toFixed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pencil, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function ViewTarifs({ navigation }: any) {
  
  const [searchParam, setSearchParam] = useState("")
  const queryClient = useQueryClient();

  const {data, isLoading, isRefetching, refetch, error} = useQuery({
    queryKey: ['driverTarifs', searchParam],
    queryFn: async () => {
      return await api.get<DriverFixedTarifs[]>(`/drivers/all-tarifs?searchParam=${searchParam}`)
    }
  })

  const handleDelete = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/drivers/delete-tarif/${id}`);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({queryKey: ['driverTarifs', searchParam]});

      const previousTarifs = queryClient.getQueryData(['driverTarifs', searchParam]);

      queryClient.setQueryData(['driverTarifs', searchParam], (old: any) => {
        return {
          ...old,
          data: old.data.filter((item: DriverFixedTarifs) => item.id !== id)
        }
      });

      return {previousTarifs}
    },
    onError: (err: any, id, context) => {
      queryClient.setQueryData(['driverTarifs', searchParam], context?.previousTarifs);
      Toast.show({
        type: "error",
        text1: "Gabim!",
        text2: err.response.data.message || "Dicka shkoi gabim ne fshirjen e tarifes."
      })
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Sukses!",
        text2: "Tarifa u fshi me sukses!"
      })
    }
  })

  console.log(data?.data);
  

  const handleEdit = (tarif: DriverFixedTarifs) => {
    // Navigate to AddFixedTarif with pre-filled data
    router.push({pathname: "/(root)/driver/section/add-fixed-tarif", params: {tarif: JSON.stringify(tarif)}})
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }} className="bg-gray-50">
      <View className="mb-4">
        <HeaderComponent title="Tarifat e Ruajtura" subtitle={"Këtu mund të menaxhoni të gjitha tarifat tua të regjistruara."}/>
      </View>
        <View className="mb-4">
            <SearchBar placeholder="Kërkoni tarifat tua" onSearch={(e) => {setSearchParam(e)}}/>
        </View>
        {(isLoading || isRefetching) ? (
          <View className="h-full bg-gray-50"><LoadingState /></View>
        ) : ((!isLoading && !isRefetching) && error) ? (
          <View className="h-full bg-gray-50"><ErrorState onRetry={refetch}/></View>
        ) : (!data || data.data.length === 0) ? (
          <View className="h-full bg-gray-50">
          <EmptyState message="Nuk keni krijuar ende tarifa fikse. Nese mendoni qe eshte gabim provoni perseri." textStyle="!font-plight !text-sm" onRetry={refetch}/>
          </View>
        ) : (
          data.data.length > 0 && data.data.map(item => (
          <View
            key={item.id}
            className="bg-white rounded-2xl p-4 mb-3 shadow-lg shadow-black/5"
          >
            <Text className="text-lg font-psemibold text-indigo-950">{item.fixedTarifTitle}</Text>
            <Text className="text-gray-600 text-sm mb-1">Çmimi: €{toFixedNoRound(item.price, 2)}</Text>
            {item.description ? (
              <Text className="text-gray-500 text-sm">{item.description}</Text>
            ) : null}

            <View className="flex-row justify-between items-center mt-3">
                <View>
                    <Text className="text-indigo-950 text-sm font-pregular bg-indigo-100 rounded-lg shadow-lg shadow-black/10 py-1 px-2">{item.city.replace("_", " ")}</Text>
                </View>
                <View className="flex-row items-center ">
                    <TouchableOpacity
                        onPress={() => handleEdit(item)}
                        className="bg-indigo-100 p-2 rounded-xl mr-2"
                    >
                        <Pencil size={18} color="#4338ca" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleDelete.mutate(item.id)}
                        className="bg-red-100 p-2 rounded-xl"
                    >
                        <Trash2 size={18} color="#dc2626" />
                    </TouchableOpacity>
                </View>
            </View>
          </View>
          ))

        )}
      
    </ScrollView>
  );
}
