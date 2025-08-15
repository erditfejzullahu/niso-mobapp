import dayjs from "dayjs";
import "dayjs/locale/sq";
import relativeTime from "dayjs/plugin/relativeTime";
import { Car, CheckCircle2, Clock, Send, Star, X } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, { Easing, FadeInLeft } from "react-native-reanimated";
import TextField from "../TextField";

dayjs.extend(relativeTime);
dayjs.locale("sq");

type ActiveDriverProps = {
  id: number;
  name: string;
  photo: string;
  rating: number;
  car: { brand: string; model: string; plate: string };
  registeredAt: string;
  onDuty: boolean;
};
//favorite page is for favorite drivers page, favoriteaddpage is for the add section of favorite drivers page.
const ActiveDrivers = ({addDriver, driverActive, favoritePage = false, favoriteAddPage = false}: {driverActive: ActiveDriverProps, favoritePage?: boolean, favoriteAddPage?: boolean;   addDriver?: (e?: string | null) => void;}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [favoriteAddModal, setFavoriteAddModal] = useState(false);
  const [favoriteAdditionalInfo, setFavoriteAdditionalInfo] = useState("")
  const [textInputFocued, setTextInputFocued] = useState(false)

  const handleAddDriver = () => {
    if(addDriver){
      addDriver(favoriteAdditionalInfo)
    }
  }

  return (
    <>
    <Animated.View entering={FadeInLeft.easing(Easing.bounce).duration(1000)}>
      <TouchableOpacity
        onPress={() => favoriteAddPage ? setFavoriteAddModal(true) : setModalVisible(true)}
        className="bg-white rounded-2xl p-4 shadow-lg shadow-black/10 border border-gray-100"
      >
        {/* Top: Driver Info */}
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: driverActive.photo }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="font-semibold text-lg text-gray-800">
              {driverActive.name}
            </Text>
            <View className="flex-row items-center">
              <Star size={14} color="#FACC15" />
              <Text className="ml-1 text-gray-500 text-sm">
                {driverActive.rating.toFixed(1)}
              </Text>
            </View>
          </View>

          {/* On Duty Badge */}
          <View
            className={`px-2 py-1 rounded-full flex-row items-center ${
              driverActive.onDuty ? "bg-green-100" : "bg-gray-200"
            }`}
          >
            <CheckCircle2
              size={14}
              color={driverActive.onDuty ? "#16A34A" : "#6B7280"}
            />
            <Text
              className={`ml-1 text-xs font-semibold ${
                driverActive.onDuty ? "text-green-600" : "text-gray-600"
              }`}
            >
              {driverActive.onDuty ? "Në detyrë" : "Jo aktiv"}
            </Text>
          </View>
        </View>

        {/* Middle: Car Info */}
        <View className="flex-row items-center mb-3">
          <Car size={18} color="#3B82F6" />
          <Text className="ml-2 text-gray-800 flex-shrink">
            {driverActive.car.brand} {driverActive.car.model} ({driverActive.car.plate})
          </Text>
        </View>

        {/* Bottom: Registered At */}
        <View className="mt-1 flex-row items-center gap-2 rounded-xl shadow-md bg-white shadow-black/10 self-start p-2">
          <Clock size={14} color="#6B7280" />
          <Text className="text-gray-500 text-sm">
            Regjistruar {dayjs(driverActive.registeredAt).fromNow()}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>


      {/* Modal with full details */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-2xl p-5 w-11/12">
            <Text className="text-lg font-psemibold text-indigo-950 mb-3">
              Detajet e shoferit
            </Text>

            <View className="items-center mb-4">
              <Image
                source={{ uri: driverActive.photo }}
                className="w-20 h-20 rounded-full mb-2"
              />
              <Text className="text-xl font-psemibold">{driverActive.name}</Text>
              <View className="flex-row items-center mt-1">
                <Star size={16} color="#FACC15" />
                <Text className="ml-1 text-indigo-600 font-psemibold">{driverActive.rating}</Text>
              </View>
            </View>

            <Text className="text-gray-700 mb-1 font-pregular">
              🚗 Makina: <Text className="text-red-600 font-psemibold">{driverActive.car.brand} {driverActive.car.model} ({driverActive.car.plate})</Text>
            </Text>
            <Text className="text-gray-700 mb-1 font-pregular">
              📅 Që nga: <Text className="text-indigo-600 font-psemibold">{dayjs(driverActive.registeredAt).format("DD MMMM YYYY")}</Text>
            </Text>
            <Text className="text-gray-700 mb-4 font-pregular">
              Statusi:{" "}
              <Text className={driverActive.onDuty ? "text-green-600 font-psemibold" : "text-gray-600 font-psemibold"}>
                {driverActive.onDuty ? "Në detyrë" : "Jo aktiv"}
              </Text>
            </Text>

            <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-indigo-600 mb-3 rounded-xl px-4 py-2 flex-row items-center gap-1 justify-center">
                <Text className="text-white font-pregular">Kontakto shoferin</Text>
                <Send color={"white"} size={18}/>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-red-600 px-4 py-2 rounded-xl flex-row items-center gap-1 justify-center"
            >
              <Text className="text-white font-pregular">Mbyll</Text>
              <X color={"white"} size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* favorite add modal */}
      <Modal visible={favoriteAddModal} animationType="slide" transparent>
        <View className={`flex-1 bg-black/40 ${textInputFocued ? "justify-start pt-10" : "justify-center"}  items-center`}>
          <View className="bg-white rounded-2xl p-5 w-11/12">
          <View className="flex-row justify-between gap-2 w-full">
            <View className="flex-1">
              <Text className="text-lg font-psemibold text-indigo-950 mb-3">
                Siguri ndërveprimi
              </Text>
              <Text className="text-gray-700 text-sm font-pregular">A jeni të sigurtë që dëshironi të shtoni shoferin <Text className="text-indigo-600">{driverActive.name}</Text> në rrethin tuaj të shoferëve të preferuar?</Text>
            </View>
            <View>
              <Image
                source={{ uri: driverActive.photo }}
                className="w-20 h-20 rounded-xl mb-2"
              />
            </View> 
          </View>



            <Text className="font-pregular mt-3 mb-1">Detaje të shoferit:</Text>
            <Text className="text-gray-700 text-sm font-pregular">
              Emri: <Text className="text-yellow-600 font-psemibold">{driverActive.name}</Text>
            </Text>
            <Text className="text-gray-700 text-sm mb-1 font-pregular">
              🚗 Makina: <Text className="text-red-600 font-psemibold">{driverActive.car.brand} {driverActive.car.model} ({driverActive.car.plate})</Text>
            </Text>
            <Text className="text-gray-700 mb-1 text-sm font-pregular">
              📅 Që nga: <Text className="text-indigo-600 font-psemibold">{dayjs(driverActive.registeredAt).format("DD MMMM YYYY")}</Text>
            </Text>
            <Text className="text-gray-700 mb-4 text-sm font-pregular">
              Statusi:{" "}
              <Text className={driverActive.onDuty ? "text-green-600 font-psemibold" : "text-gray-600 font-psemibold"}>
                {driverActive.onDuty ? "Në detyrë" : "Jo aktiv"}
              </Text>
            </Text>

            <TextField 
              value={favoriteAdditionalInfo}
              onChangeText={setFavoriteAdditionalInfo}
              placeholder="P.Sh. Djali me X5"
              title="Informacione shtesë /opsionale"
              className={'mb-3'}
              onFocus={() => setTextInputFocued(true)}
              onBlur={() => setTextInputFocued(false)}
            />

            <TouchableOpacity onPress={() => handleAddDriver()} className="bg-indigo-600 mb-3 rounded-xl px-4 py-2 flex-row items-center gap-1 justify-center">
                <Text className="text-white font-pregular">Shtoni</Text>
                <Send color={"white"} size={18}/>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFavoriteAddModal(false)}
              className="bg-red-600 px-4 py-2 rounded-xl flex-row items-center gap-1 justify-center"
            >
              <Text className="text-white font-pregular">Mbyll</Text>
              <X color={"white"} size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ActiveDrivers;
