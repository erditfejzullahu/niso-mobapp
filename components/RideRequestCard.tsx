import dayjs from "dayjs";
import "dayjs/locale/sq";
import relativeTime from "dayjs/plugin/relativeTime";
import { router } from "expo-router";
import { AlertTriangle, ArrowRight, Clock, MapPin, MapPinCheck, X } from "lucide-react-native";
import { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

dayjs.extend(relativeTime);
dayjs.locale('sq')

type RideRequestCardProps = {
  clientName: string;
  clientPhoto: string;
  from: string;
  to: string;
  price?: number | null;
  urgent?: boolean;
  dateCreated: string;
  distanceKm?: number; // new
  id: number;
};

export default function RideRequestCard({
  clientName,
  clientPhoto,
  from,
  to,
  price,
  urgent,
  dateCreated,
  distanceKm,
  id
}: RideRequestCardProps) {

  const [proceedModal, setProceedModal] = useState(false)

  return (
    <>
    <TouchableOpacity onPress={() => setProceedModal(true)} className="bg-white rounded-2xl p-4 shadow-md shadow-black/5 border-gray-100 mb-4">
      {/* Top: Client info */}
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: clientPhoto }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="font-semibold text-lg text-gray-800">
            {clientName}
          </Text>
          <View className="flex-row items-center">
            <Clock size={14} color="#6B7280" />
            <Text className="ml-1 text-gray-500 text-sm">
              {dayjs(dateCreated).fromNow()}
            </Text>
          </View>
        </View>

        {/* Urgent badge */}
        {urgent && (
          <View className="bg-red-100 px-2 py-1 rounded-full flex-row items-center">
            <AlertTriangle size={14} color="#DC2626" />
            <Text className="ml-1 text-red-600 text-xs font-semibold">
              Urgjente
            </Text>
          </View>
        )}
      </View>

      {/* Middle: From → To */}
      <View className="flex-row items-center mb-3">
        <MapPin size={18} color="#3B82F6" />
        <Text className="ml-2 text-gray-800 flex-shrink">{from}</Text>
        <ArrowRight size={18} color="#9CA3AF" className="mx-2" />
        <MapPin size={18} color="#10B981" />
        <Text className="ml-2 text-gray-800 flex-shrink">{to}</Text>
      </View>

      {/* Bottom: Price + Distance */}
      <View className="mt-1 flex-row items-center gap-2 flex-wrap rounded-xl shadow-md bg-white shadow-black/10 self-start p-2">
        <Text className="text-gray-500 text-sm">Çmimi i kërkuar</Text>
        <View className="flex-row items-center">
          {distanceKm !== undefined && (
            <View className="bg-blue-50 px-2 py-0.5 rounded-full mr-2">
              <Text className="text-blue-600 text-xs font-medium">
                {distanceKm} km
              </Text>
            </View>
          )}
          <Text className="font-semibold text-base text-gray-800">
            {price ? `${price} €` : "Llogaritet sipas distancës"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>

    <Modal visible={proceedModal} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="bg-white rounded-xl p-5 w-11/12">
          <Text className="text-lg font-psemibold text-indigo-950 mb-3">Njoftim mbi veprimin</Text>
          <Text className="text-gray-700 text-xs font-pregular mb-3">Duke klikuar <Text className="text-indigo-600 font-psemibold">'Procedo'</Text>, ju pranoni përgjegjësinë për transportimin e personit në destinacion. Nëse dështoni në respektimin e <Text className="text-indigo-600 font-psemibold">Termave të Përdorimit</Text> të <Text className="text-indigo-600 font-psemibold">Niso</Text>, llogaria juaj do të vlerësohet negativisht deri në pezullim të përhershëm.</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity onPress={() => setProceedModal(false)} className="px-4 py-1.5 rounded-lg flex-row items-center gap-1 bg-red-600">
              <Text className="text-white font-pregular">Anulo</Text>
              <X color={"white"} size={18}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {router.push(`/(root)/driver/section/active-routes/${id}`); setProceedModal(false)}} className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center gap-1">
              <Text className="text-white font-pregular">Procedo</Text>
              <MapPinCheck color={"white"} size={18}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </>
  );
}
