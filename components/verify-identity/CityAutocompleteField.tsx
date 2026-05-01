import React, { memo } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

function CityAutocompleteFieldBase(props: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  onFocus: () => void;
  citiesShown: string[];
  showDropdown: boolean;
  onSelectCity: (v: string) => void;
  errorMessages?: string[];
}) {
  const {
    label,
    placeholder,
    value,
    onChangeText,
    onFocus,
    citiesShown,
    showDropdown,
    onSelectCity,
    errorMessages,
  } = props;

  return (
    <View className="mb-2 border-b border-gray-200 relative z-10">
      <Text className="text-gray-700 mb-1 font-pmedium">{label}</Text>
      <TextInput
        className="text-gray-800 h-[35px] font-pregular"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
      />

      {!!errorMessages?.length &&
        errorMessages.map((m) => (
          <Text key={m} className="text-xs font-plight text-red-500 mt-1">
            {m}
          </Text>
        ))}

      {showDropdown && citiesShown.length > 0 && (
        <View className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-40 shadow-lg shadow-black/20 z-20">
          <ScrollView className="max-h-40" keyboardShouldPersistTaps="handled">
            {citiesShown.map((cityName) => (
              <TouchableOpacity
                key={cityName}
                className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                onPress={() => onSelectCity(cityName)}
              >
                <Text className="text-gray-800 font-pregular">{cityName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export const CityAutocompleteField = memo(CityAutocompleteFieldBase);

