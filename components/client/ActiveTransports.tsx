import dayjs from "dayjs";
import "dayjs/locale/sq";
import relativeTime from "dayjs/plugin/relativeTime";
import { router } from "expo-router";
import { ArrowRight, Clock, Frown, Laugh, MapPin, MapPinCheck, Meh, Smile, Star, X } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

dayjs.extend(relativeTime);
dayjs.locale("sq");

type ActiveTransportProps = {
  driverName: string;
  passengerName: string;
  passengerPhoto: string;
  from: string;
  to: string;
  price: number;
  dateStarted: string;
  inProgress: boolean;
  id: number;
  hasTransport: boolean;
};

const ActiveTransports = () => {
  // Dummy data
  const activeTransport: ActiveTransportProps = {
    driverName: "Arben Hoxha",
    passengerName: "Eriona Krasniqi",
    passengerPhoto: "https://randomuser.me/api/portraits/women/44.jpg",
    from: "Sheshi Skënderbej, Tiranë",
    to: "Rruga e Elbasanit, Tiranë",
    price: 6.5,
    dateStarted: dayjs().subtract(15, "minute").toISOString(),
    inProgress: true,
    id: 101,
    hasTransport: true
  };

  const [proceedModal, setProceedModal] = useState(false);
  const [rateNowModal, setRateNowModal] = useState(false);

  const [rateNowImmidiately, setRateNowImmidiately] = useState(false); //modal
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  const handleSelectedRatingForDriver = (rating: number) => {
    setSelectedRating(rating)
    Toast.show({
        type: "success",
        text1: "Vlerësimi shkoi me sukses",
        text2: "Kujdes: vlerësimi duhet të jetë i sinqert!"
    })
    setRateNowImmidiately(false)
  }

  if(!activeTransport.hasTransport) return (
    <View className="bg-white items-center gap-1 rounded-2xl p-4 shadow-md shadow-black/5 border-gray-100 flex-row">
        <MapPin color={"#6366F1"} size={18}/>
        <Text className="font-pregular text-sm">Nuk keni transport aktiv.</Text>
    </View>
  )

  return (
    <>
      <TouchableOpacity
        onPress={() => setProceedModal(true)}
        className="bg-white rounded-2xl p-4 shadow-md shadow-black/5 border-gray-100"
      >
        <Text className="font-pregular text-xs text-indigo-600">{activeTransport.inProgress ? "Transporti aktiv..." : "Transporti në pritje..."}</Text>
        {/* Top: Driver & Passenger */}
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: activeTransport.passengerPhoto }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="font-semibold text-lg text-gray-800">
              {activeTransport.passengerName}
            </Text>
            <Text className="text-gray-500 text-xs">Shofer: {activeTransport.driverName}</Text>
            <View className="flex-row items-center">
              <Clock size={14} color="#6B7280" />
              <Text className="ml-1 text-gray-500 text-sm">
                {dayjs(activeTransport.dateStarted).fromNow()}
              </Text>
            </View>
          </View>

          {/* Status badge */}
          <View
            className={`px-2 py-1 rounded-full flex-row items-center ${
              activeTransport.inProgress ? "bg-green-100" : "bg-yellow-100"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                activeTransport.inProgress ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {activeTransport.inProgress ? "Në proces" : "Nuk ka filluar"}
            </Text>
          </View>
        </View>

        {/* Middle: From → To */}
        <View className="flex-row items-center mb-3">
          <MapPin size={18} color="#3B82F6" />
          <Text className="ml-2 text-gray-800 flex-shrink">{activeTransport.from}</Text>
          <ArrowRight size={18} color="#9CA3AF" className="mx-2" />
          <MapPin size={18} color="#10B981" />
          <Text className="ml-2 text-gray-800 flex-shrink">{activeTransport.to}</Text>
        </View>

        {/* Bottom: Price */}
        <View className="mt-1 flex-row items-center gap-2 rounded-xl shadow-md bg-white shadow-black/10 self-start p-2">
          <Text className="text-gray-500 text-sm">Çmimi</Text>
          <Text className="font-semibold text-base text-gray-800">
            {activeTransport.price} €
          </Text>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={proceedModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-xl p-5 w-11/12">
            <Text className="text-lg font-psemibold text-indigo-950 mb-3">
              Detajet e transportit aktiv
            </Text>
            <Text className="text-gray-700 text-sm mb-3">
              Ky transport është {activeTransport.inProgress ? "aktualisht në proces" : "ende nuk ka filluar"}.  
              Shoferi <Text className="text-indigo-600 font-psemibold">{activeTransport.driverName} </Text>  
              po transporton <Text className="text-indigo-600 font-psemibold">{activeTransport.passengerName} </Text>  
              nga <Text className="text-indigo-600">{activeTransport.from} </Text>  
              deri te <Text className="text-indigo-600">{activeTransport.to} </Text>.
            </Text>

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setProceedModal(false)}
                className="px-4 py-1.5 rounded-lg flex-row items-center gap-1 bg-red-600"
              >
                <Text className="text-white font-pregular">Mbyll</Text>
                <X color={"white"} size={18} />
              </TouchableOpacity>

                <TouchableOpacity onPress={() => {setProceedModal(false); setRateNowModal(true);}} className="bg-yellow-600 animate-pulse gap-1 px-4 py-1.5 rounded-lg flex-row items-center justify-center">
                    <Star color={"white"} size={18}/>
                </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  router.push(`/(root)/driver/section/active-routes/${activeTransport.id}`);
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

        {/* do you want to rate modal */}
      <Modal visible={rateNowModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-xl p-5 w-11/12">
            <Text className="text-lg font-psemibold text-indigo-950 mb-3">
              Dëshironi të vlerësoni shoferin?
            </Text>
            <Text className="text-gray-700 text-sm">Ky modal shërben për vlerësimin e shoferit <Text className="font-psemibold text-indigo-600">{activeTransport.driverName}</Text></Text>
            <Text className="text-indigo-600 text-sm mb-3">Për të proceduar në vlerësimin e shoferit shtypni butonin <Text className="font-psemibold">"Procedo"</Text></Text>

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setRateNowModal(false)}
                className="px-4 py-1.5 rounded-lg flex-row items-center gap-1 bg-red-600"
              >
                <Text className="text-white font-pregular">Mbyll</Text>
                <X color={"white"} size={18} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setRateNowModal(false);
                  setRateNowImmidiately(true);
                }}
                className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center gap-1"
              >
                <Text className="text-white font-pregular">Procedo</Text>
                <Star color={"white"} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

        {/* rate now modal */}
      <Modal visible={rateNowImmidiately} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="bg-white rounded-xl p-5 w-11/12">
            <Text className="text-lg font-psemibold text-indigo-950 mb-3">
                Vlerësoni tani shoferin
            </Text>
            <Text className="text-gray-700 text-sm text-center leading-none mb-1">
                Ky modal për vlerësimin e shoferit{" "}
                <Text className="text-indigo-600">{activeTransport.driverName}</Text>{" "}
                duhet të jap vlerësime të sinqerta në lidhje me sjelljen apo udhëtimin tuaj.
            </Text>
            <Text className="font-psemibold text-sm text-center mb-3">
                (Çdo vlerësim i rrejshëm rezulton në pezullimin e llogarisë tuaj.)
            </Text>

            {/* Rating Options */}
            <View className="flex-row justify-between mb-4">
                {[
                { icon: Frown, label: "Shumë Keq", value: 1, color: "#DC2626" },
                { icon: Meh, label: "Keq", value: 2, color: "#F97316" },
                { icon: Smile, label: "Mirë", value: 3, color: "#EAB308" },
                { icon: Laugh, label: "Shumë Mirë", value: 4, color: "#10B981" },
                { icon: Star, label: "Perfekt", value: 5, color: "#3B82F6" },
                ].map((item) => (
                <TouchableOpacity
                    key={item.value}
                    onPress={() => handleSelectedRatingForDriver(item.value)}
                    className={`items-center flex-1 ${
                    selectedRating === item.value ? "opacity-100" : "opacity-60"
                    }`}
                >
                    <item.icon size={32} color={item.color} />
                    <Text className="text-xs mt-1 text-gray-700">{item.label}</Text>
                </TouchableOpacity>
                ))}
            </View>

            {/* Buttons */}
            <View className="flex-row justify-between">
                <TouchableOpacity
                onPress={() => setRateNowImmidiately(false)}
                className="px-4 py-1.5 rounded-lg flex-row items-center flex-1 justify-center gap-1 bg-red-600"
                >
                <Text className="text-white font-pregular">Mbyll</Text>
                <X color={"white"} size={18} />
                </TouchableOpacity>
            </View>
            </View>
        </View>
    </Modal>
    </>
  );
};

export default ActiveTransports;
