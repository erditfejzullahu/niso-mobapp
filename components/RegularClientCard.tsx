import dayjs from "dayjs";
import "dayjs/locale/sq";
import relativeTime from "dayjs/plugin/relativeTime";
import { Clock, MailPlus, MapPin, Star, Trash, UserPen, X } from "lucide-react-native";
import { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

dayjs.extend(relativeTime);
dayjs.locale("sq");

type RegularClientCardProps = {
  name: string;
  photo: string;
  ridesCount: number;
  averageRating?: number;
  lastRideDate: string;
  mainPickup: string;
  note?: string;
};

export default function RegularClientCard({
  name,
  photo,
  ridesCount,
  averageRating,
  lastRideDate,
  mainPickup,
  note,
}: RegularClientCardProps) {
  const [popupModal, setPopupModal] = useState(false)
  return (
    <>
      <TouchableOpacity onPress={() => setPopupModal(true)} className="bg-white rounded-2xl p-4 shadow-md shadow-black/5 mb-4">
        {/* Top Row: Photo + Name + Rides */}
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: photo }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="font-semibold text-lg text-gray-800">{name}</Text>
            <Text className="text-gray-500 text-sm">
              {ridesCount} udhëtime të përfunduara
            </Text>
          </View>
          {averageRating && (
            <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-full">
              <Star size={14} color="#FBBF24" fill="#FBBF24" />
              <Text className="ml-1 text-yellow-600 text-xs font-semibold">
                {averageRating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Main Pickup */}
        <View className="flex-row items-center mb-2">
          <MapPin size={16} color="#3B82F6" />
          <Text className="ml-2 text-gray-700">{mainPickup}</Text>
        </View>

        {/* Last Ride */}
        <View className="flex-row items-center mb-2">
          <Clock size={16} color="#6B7280" />
          <Text className="ml-2 text-gray-500 text-sm">
            Udhëtimi i fundit: {dayjs(lastRideDate).fromNow()}
          </Text>
        </View>

        {/* Optional Note */}
        {note && (
          <View className="bg-indigo-50 px-3 py-2 rounded-xl">
            <Text className="text-indigo-700 text-sm">{note}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={popupModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-xl p-5 w-11/12">
            <Text className="text-lg font-psemibold text-indigo-950 mb-3">Ndërveprimet</Text>
            <View className="gap-2">
              <TouchableOpacity className="bg-indigo-600 flex-row gap-2 rounded-lg py-2 justify-center items-center">
                <Text className="font-psemibold text-white">Kërko kontakt</Text>
                <MailPlus color={"white"}/>
              </TouchableOpacity>
              <View className="border-t my-2 border-gray-200"/>
              <TouchableOpacity onPress={() => setPopupModal(false)} className="bg-red-600 flex-row gap-2 rounded-lg py-2 justify-center items-center">
                <Text className="text-white font-psemibold">Largo dritaren</Text>
                <X color={"white"} size={18}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
