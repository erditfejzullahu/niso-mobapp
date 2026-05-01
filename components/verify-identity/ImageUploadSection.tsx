import React, { memo } from "react";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

function ImageUploadSectionBase(props: {
  selfie: string;
  idFront: string;
  idBack: string;
  onTakeSelfie: () => void;
  onPick: (field: "selfie" | "idFront" | "idBack") => void;
  onRemove: (field: "selfie" | "idFront" | "idBack") => void;
  selfieErrors?: string[];
  idFrontErrors?: string[];
  idBackErrors?: string[];
}) {
  const {
    selfie,
    idFront,
    idBack,
    onTakeSelfie,
    onPick,
    onRemove,
    selfieErrors,
    idFrontErrors,
    idBackErrors,
  } = props;

  return (
    <>
      <View className="mb-6">
        <Text className="text-gray-700 mb-3 font-pmedium">Selfie</Text>
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="flex-1 mr-2 items-center justify-center py-4 border border-dashed border-gray-400 rounded-lg"
            onPress={onTakeSelfie}
          >
            <Ionicons name="camera" size={24} color="#4f46e5" />
            <Text className="text-indigo-600 font-pregular mt-1 text-center px-1">Bëni foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 ml-2 items-center justify-center py-4 border border-dashed border-gray-400 rounded-lg"
            onPress={() => onPick("selfie")}
          >
            <MaterialIcons name="photo-library" size={24} color="#4f46e5" />
            <Text className="text-indigo-600 font-pregular mt-1 text-center px-1">
              Zgjidhni nga galeria
            </Text>
          </TouchableOpacity>
        </View>
        {!!selfieErrors?.length &&
          selfieErrors.map((m) => (
            <Text key={m} className="text-xs font-plight text-red-500 mt-1">
              {m}
            </Text>
          ))}
        {!!selfie && (
          <View className="mt-4 items-center">
            <Image source={{ uri: selfie }} className="w-32 h-32 rounded-lg" />
            <TouchableOpacity onPress={() => onRemove("selfie")} className="mt-2">
              <Text className="text-red-500 font-pregular">Hiq foton</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 mb-3 font-pmedium">Letërnjoftimi (Ana e përparme)</Text>
        <TouchableOpacity
          className="items-center justify-center py-6 border border-dashed border-gray-400 rounded-lg"
          onPress={() => onPick("idFront")}
        >
          <FontAwesome name="id-card-o" size={24} color="#4f46e5" />
          <Text className="text-indigo-600 font-pregular mt-2 px-1 text-center">
            Ngarkoni anën e përparme
          </Text>
        </TouchableOpacity>
        {!!idFrontErrors?.length &&
          idFrontErrors.map((m) => (
            <Text key={m} className="text-xs font-plight text-red-500 mt-1">
              {m}
            </Text>
          ))}
        {!!idFront && (
          <View className="mt-4 items-center">
            <Image source={{ uri: idFront }} className="w-full h-48 rounded-lg" resizeMode="contain" />
            <TouchableOpacity onPress={() => onRemove("idFront")} className="mt-2">
              <Text className="text-red-500 font-pregular px-1 text-center">Hiq foton</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="mb-8">
        <Text className="text-gray-700 mb-3 font-pmedium">Letërnjoftimi (Ana e pasme)</Text>
        <TouchableOpacity
          className="items-center justify-center py-6 border border-dashed border-gray-400 rounded-lg"
          onPress={() => onPick("idBack")}
        >
          <FontAwesome name="id-card" size={24} color="#4f46e5" />
          <Text className="text-indigo-600 font-pregular mt-2 px-1 text-center">
            Ngarkoni anën e pasme
          </Text>
        </TouchableOpacity>
        {!!idBackErrors?.length &&
          idBackErrors.map((m) => (
            <Text key={m} className="text-xs font-plight text-red-500 mt-1">
              {m}
            </Text>
          ))}
        {!!idBack && (
          <View className="mt-4 items-center">
            <Image source={{ uri: idBack }} className="w-full h-48 rounded-lg" resizeMode="contain" />
            <TouchableOpacity onPress={() => onRemove("idBack")} className="mt-2">
              <Text className="text-red-500 font-pregular px-1 text-center">Hiq foton</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

export const ImageUploadSection = memo(ImageUploadSectionBase);

