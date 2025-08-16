import { router } from "expo-router";
import { Clock, MapPin, Pencil, Trash2, X } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type RotationProps = {
  fromAddress: string;
  toAddress: string;
  time?: string | null;
  days?: string[]; // e.g. ["E Hënë", "E Martë"]
  onDelete?: () => void;
};

const ClientRotationCard = ({
  fromAddress,
  toAddress,
  time,
  days = [],
  onDelete,
}: RotationProps) => {
  const [modalVisible, setModalVisible] = useState(false);
    const rotation = {
        fromAddress,
        toAddress,
        time,
        days
    }
  return (
    <>
      {/* Card */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-white rounded-2xl p-4 shadow-lg shadow-black/5 mb-3"
      >
        {/* From → To */}
        <View className="flex-row items-center mb-3">
          <MapPin size={18} color="#2563eb" />
          <Text className="ml-2 text-gray-700 font-pmedium flex-shrink">
            {fromAddress}
          </Text>
          <Text className="mx-2 text-gray-500">→</Text>
          <MapPin size={18} color="#16a34a" />
          <Text className="ml-2 text-gray-700 font-pmedium flex-shrink">
            {toAddress}
          </Text>
        </View>

        {/* Time (optional) */}
        {time && (
          <View className="flex-row items-center mb-3">
            <Clock size={18} color="#f59e0b" />
            <Text className="ml-2 text-gray-600">{time}</Text>
          </View>
        )}

        {/* Days */}
        {days.length > 0 && (
          <View>
            <Text className="text-gray-700 font-pmedium mb-1">Ditët:</Text>
            <View className="flex-row flex-wrap">
              {days.map((day, index) => (
                <View
                  key={index}
                  className="bg-blue-100 px-3 py-1 rounded-xl mr-2 mb-2"
                >
                  <Text className="text-blue-700 text-sm font-pmedium">
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal for actions */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white w-11/12 rounded-2xl p-5">
            <Text className="text-lg font-psemibold text-gray-800 mb-4">
              Opsionet e rotacionit
            </Text>

            {/* Edit Button */}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                router.push({pathname: "/client/section/create-rotation", params: {rotation: JSON.stringify(rotation)}})
              }}
              className="flex-row items-center gap-2 bg-blue-600 px-4 py-3 rounded-xl mb-3"
            >
              <Pencil size={18} color="white" />
              <Text className="text-white font-pregular">Edito</Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                onDelete?.();
              }}
              className="flex-row items-center gap-2 bg-red-600 px-4 py-3 rounded-xl mb-3"
            >
              <Trash2 size={18} color="white" />
              <Text className="text-white font-pregular">Fshij</Text>
            </TouchableOpacity>

            {/* Close */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="flex-row items-center gap-2 bg-gray-200 px-4 py-3 rounded-xl"
            >
              <X size={18} color="black" />
              <Text className="text-gray-700 font-pregular">Mbyll</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ClientRotationCard;
