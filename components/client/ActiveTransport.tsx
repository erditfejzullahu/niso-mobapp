import { ActivePassengerRide, User } from "@/types/app-types";
import { toFixedNoRound } from "@/utils/toFixed";
import dayjs from "dayjs";
import "dayjs/locale/sq";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "expo-router";
import { ArrowRight, Clock, Frown, Laugh, MapPin, MapPinCheck, Meh, Smile, Star, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import Animated from "react-native-reanimated";
import { usePulseAnimation } from "@/hooks/usePulseAnimation";
import RateNowModals from "./RateNowModals";
dayjs.extend(relativeTime);
dayjs.locale("sq");


const ActiveTransports = ({user, activeRide}: {user: User, activeRide: ActivePassengerRide | null}) => {

  const router = useRouter()

  const animatedStyle = usePulseAnimation({});
  

  const [proceedModal, setProceedModal] = useState(false);


  const [rateNowModal, setRateNowModal] = useState(false); //modali pare per review
  const [rateNowImmidiately, setRateNowImmidiately] = useState(false); //modal dyte per review
  const [longPressModal, setLongPressModal] = useState(false)

  if(!activeRide) return (
    <View className="bg-white items-center gap-1 rounded-2xl p-4 shadow-md shadow-black/5 border-gray-100 flex-row">
        <MapPin color={"#6366F1"} size={18}/>
        <Text className="font-pregular text-sm">Nuk keni transport aktiv.</Text>
    </View>
  )

  return (
    <>
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onLongPress={() => setLongPressModal(true)}
        onPress={() => setProceedModal(true)}
        className="bg-white rounded-2xl p-4 shadow-md shadow-black/5 border-gray-100"
      >
        <Text className="font-pregular text-xs text-indigo-600">{activeRide.status === "DRIVING" ? "Transporti aktiv..." : "Transporti në pritje..."}</Text>
        {/* Top: Driver & Passenger */}
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: user.image }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="font-psemibold text-lg text-indigo-950">
              {user.fullName}
            </Text>
            <Text className="text-gray-500 text-xs font-pregular">Shofer: <Text className="text-indigo-600">{activeRide.driver.fullName}</Text></Text>
            <View className="flex-row items-center">
              <Clock size={14} color="#6B7280" />
              <Text className="ml-1 text-gray-500 mt-0.5 text-xs font-pregular">
                {dayjs(activeRide.rideInfo.createdAt).fromNow()}
              </Text>
            </View>
          </View>

          {/* Status badge */}
          <View
            className={`px-2 py-1 rounded-full flex-row items-center ${
              activeRide.status === "DRIVING" ? "bg-green-100" : "bg-yellow-100"
            }`}
          >
            <Text
              className={`text-xs font-psemibold ${
                activeRide.status === "DRIVING" ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {activeRide.status === "DRIVING" ? "Në proces" : "Nuk ka filluar"}
            </Text>
          </View>
        </View>

        {/* Middle: From → To */}
        <View className="flex-row items-center mb-3">
          <MapPin size={16} color="#3B82F6" />
          <Text className="ml-1 text-gray-800 flex-shrink font-pregular text-sm" numberOfLines={1}>{activeRide.rideInfo.fromAddress}</Text>
          <View className="mx-2"><ArrowRight size={16} color="#9CA3AF" /></View>
          <MapPin size={16} color="#10B981" />
          <Text className="ml-1 text-gray-800 flex-shrink font-pregular text-sm" numberOfLines={1}>{activeRide.rideInfo.toAddress}</Text>
        </View>

        {/* Bottom: Price */}
        <View className="flex-row items-center justify-between">
          <View className="mt-1 flex-row items-center gap-2 rounded-xl shadow-md bg-white shadow-black/10 self-start p-2">
            <Text className="text-gray-500 text-sm font-pregular">Çmimi</Text>
            <Text className="font-psemibold text-base text-indigo-950">
              {toFixedNoRound(activeRide.rideInfo.price, 2)} €
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
              <Text className="text-gray-500 text-sm font-pregular">Distanca</Text>
              <Text className="font-psemibold text-base text-indigo-950">{toFixedNoRound(activeRide.rideInfo.distance, 2)} Km</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>

      {/* Modal */}
      <Modal visible={proceedModal} animationType="slide" transparent onRequestClose={() => setProceedModal(false)}>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-xl p-5 w-11/12">
            <Text className="text-lg font-psemibold text-indigo-950 mb-3">
              Detajet e transportit aktiv
            </Text>
            <Text className="text-indigo-950 font-pregular text-sm mb-3">
              Ky transport {activeRide.status === "DRIVING" ? "është aktualisht në proces" : "ende nuk ka filluar"}.  
              Shoferi <Text className="text-indigo-600 font-psemibold">{activeRide.driver.fullName} </Text>  
              po transporton <Text className="text-indigo-600 font-psemibold">{user.fullName} </Text>  
              nga <Text className="text-red-600 font-psemibold">{activeRide.rideInfo.fromAddress} </Text>  
              deri te <Text className="text-red-600 font-psemibold">{activeRide.rideInfo.toAddress} </Text>.
            </Text>

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setProceedModal(false)}
                className="px-4 py-1.5 rounded-lg flex-row items-center gap-1 bg-red-600"
              >
                <Text className="text-white font-pregular">Mbyll</Text>
                <X color={"white"} size={18} />
              </TouchableOpacity>

                <TouchableOpacity style={animatedStyle} onPress={() => {setProceedModal(false); setRateNowModal(true);}} className="bg-yellow-600 gap-1 px-4 py-1.5 rounded-lg flex-row items-center justify-center">
                    <Star color={"white"} size={18}/>
                </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  router.push(`/(root)/driver/section/active-routes/${activeRide.id}`);
                  setProceedModal(false);
                }}
                className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center gap-1"
              >
                <Text className="text-white font-pregular">Shiko</Text>
                <MapPinCheck color={"white"} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <RateNowModals ride={activeRide} editRideModal={longPressModal} setEditRideModal={setLongPressModal} rateModal={rateNowModal} setRateModal={setRateNowModal} setRate2Modal={setRateNowImmidiately} rate2Modal={rateNowImmidiately}/>
    </>
  );
};

export default ActiveTransports;
