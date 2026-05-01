import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

function GenderSelectorBase(props: {
  value: "MALE" | "FEMALE" | "RATHER_NOT_SAY";
  onChange: (v: "MALE" | "FEMALE" | "RATHER_NOT_SAY") => void;
}) {
  const { value, onChange } = props;

  return (
    <View className="mb-6 border-gray-200">
      <Text className="text-gray-700 mb-1 font-pmedium">Gjinia</Text>
      <View className="flex-row justify-between mt-2">
        <TouchableOpacity
          className={`flex-1 mr-2 py-3 rounded-lg border ${
            value === "MALE" ? "bg-indigo-100 border-indigo-600" : "border-gray-300"
          }`}
          onPress={() => onChange("MALE")}
        >
          <Text
            className={`text-center font-pmedium ${
              value === "MALE" ? "text-indigo-600" : "text-gray-600"
            }`}
          >
            Mashkull
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 ml-2 py-3 rounded-lg border ${
            value === "FEMALE" ? "bg-indigo-100 border-indigo-600" : "border-gray-300"
          }`}
          onPress={() => onChange("FEMALE")}
        >
          <Text
            className={`text-center font-pmedium ${
              value === "FEMALE" ? "text-indigo-600" : "text-gray-600"
            }`}
          >
            Femër
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className={`flex-1 mt-2 py-3 rounded-lg border ${
          value === "RATHER_NOT_SAY" ? "bg-indigo-100 border-indigo-600" : "border-gray-300"
        }`}
        onPress={() => onChange("RATHER_NOT_SAY")}
      >
        <Text
          className={`text-center font-pmedium ${
            value === "RATHER_NOT_SAY" ? "text-indigo-600" : "text-gray-600"
          }`}
        >
          Tjeter
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const GenderSelector = memo(GenderSelectorBase);

