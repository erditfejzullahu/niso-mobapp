import HeaderComponent from "@/components/HeaderComponent";
import SearchBar from "@/components/SearchBar";
import { router } from "expo-router";
import { Pencil, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ViewTarifs({ navigation }: any) {
  const [tarifs, setTarifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real scenario: fetch from API
    // For now: load dummy tariffs from local storage or test data
    setTimeout(() => {
      setTarifs([
        { id: 1, areaName: "Bregu i Diellit", price: 5, description: "Shërbim ditor", city: "Gjakova" },
        { id: 2, areaName: "Qendra", price: 7.5, description: "Tarifë për qendër", city: "Prishtina" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert(
      "Fshi Tarifën",
      "A jeni të sigurt që dëshironi ta fshini këtë tarifë?",
      [
        { text: "Anulo", style: "cancel" },
        {
          text: "Po, fshij",
          style: "destructive",
          onPress: () => setTarifs((prev) => prev.filter((t) => t.id !== id)),
        },
      ]
    );
  };

  const handleEdit = (tarif: any) => {
    // Navigate to AddFixedTarif with pre-filled data
    router.push({pathname: "/(root)/driver/section/add-fixed-tarif", params: {tarif: JSON.stringify(tarif)}})
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4338ca" />
        <Text className="mt-3 text-gray-500">Duke ngarkuar tarifat...</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }} className="bg-gray-50">
      <HeaderComponent title="Tarifat e Ruajtura" subtitle={"Këtu mund të menaxhoni të gjitha tarifat tua të regjistruara."} style={"mb-4"}/>
        <View className="mb-4">
            <SearchBar placeholder="Kërkoni tarifat tua" onSearch={() => {}}/>
        </View>
      {tarifs.length === 0 ? (
        <Text className="text-gray-500">Nuk keni tarifa të regjistruara.</Text>
      ) : (
        tarifs.map((tarif) => (
          <View
            key={tarif.id}
            className="bg-white rounded-2xl p-4 mb-3 shadow-lg shadow-black/5"
          >
            <Text className="text-lg font-psemibold text-indigo-950">{tarif.areaName}</Text>
            <Text className="text-gray-600 text-sm mb-1">Çmimi: €{tarif.price}</Text>
            {tarif.description ? (
              <Text className="text-gray-500 text-sm">{tarif.description}</Text>
            ) : null}

            <View className="flex-row justify-between items-center mt-3">
                <View>
                    <Text className="text-indigo-950 text-sm font-pregular bg-indigo-100 rounded-lg shadow-lg shadow-black/10 py-1 px-2">{tarif.city}</Text>
                </View>
                <View className="flex-row items-center ">
                    <TouchableOpacity
                        onPress={() => handleEdit(tarif)}
                        className="bg-indigo-100 p-2 rounded-xl mr-2"
                    >
                        <Pencil size={18} color="#4338ca" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleDelete(tarif.id)}
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
