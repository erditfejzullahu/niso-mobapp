import HeaderComponent from "@/components/HeaderComponent";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDays, Clock, LocationEdit, MapPin, Save } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const CreateRotationForm = ({ onSave }: { onSave: (rotation: any) => void }) => {
  const daysOfWeek = [
    { label: "E Hënë", value: "monday" },
    { label: "E Martë", value: "tuesday" },
    { label: "E Mërkurë", value: "wednesday" },
    { label: "E Enjte", value: "thursday" },
    { label: "E Premte", value: "friday" },
    { label: "E Shtunë", value: "saturday" },
    { label: "E Diel", value: "sunday" },
  ];
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [time, setTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    const newRotation = { fromAddress, toAddress, days: selectedDays, time };
    onSave(newRotation);
    setFromAddress("");
    setToAddress("");
    setSelectedDays([]);
    setTime(null);
  };

  return (
    <KeyboardAwareScrollView className="p-4 bg-gray-50">
      <HeaderComponent title={"Krijo rotacion"} subtitle={"Këtu mund të shtoni rotacione që mund t'i përdorni për të lidhur 'Kontratë' me shoferët e Niso. P.sh. nga puna në banesë."}/>

      <View className="bg-white rounded-xl p-3 mt-3 shadow-lg shadow-black/5">
        {/* From Address */}
        <View className="mb-3">
          <Text className="font-semibold text-gray-700 mb-1">Prej</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2">
            <MapPin size={18} color="#4f46e5" />
            <TextInput
              value={fromAddress}
              onChangeText={setFromAddress}
              placeholder="Adresa e nisjes"
              className="ml-2 flex-1"
            />
          </View>
        </View>

        {/* To Address */}
        <View className="mb-3">
          <Text className="font-semibold text-gray-700 mb-1">Deri</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2">
            <MapPin size={18} color="#4f46e5" />
            <TextInput
              value={toAddress}
              onChangeText={setToAddress}
              placeholder="Adresa e destinacionit"
              className="ml-2 flex-1"
            />
          </View>
        </View>

        {/* Days Selection */}
        <Text className="font-semibold text-gray-700 mb-2">Ditet</Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day.value}
              className={`px-3 py-2 rounded-xl border ${
                selectedDays.includes(day.value)
                  ? "bg-indigo-600 border-indigo-600"
                  : "bg-gray-100 border-gray-300"
              }`}
              onPress={() => toggleDay(day.value)}
            >
              <Text
                className={`${
                  selectedDays.includes(day.value) ? "text-white" : "text-gray-700"
                }`}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time Selection */}
        <View className="mb-3">
          <Text className="font-semibold text-gray-700 mb-1">Ora (opsionale)</Text>
          <TouchableOpacity
            className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2"
            onPress={() => setShowTimePicker(!showTimePicker)}
          >
            <Clock size={18} color="#4f46e5" />
            <Text className="ml-2 text-gray-700">
              {time ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Zgjedh orën"}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time || new Date()}
              mode="time"
              is24Hour
              style={{marginLeft: -10, marginTop: 10}}
              display="default"
              onChange={(_, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setTime(selectedTime);
              }}
            />
          )}
        </View>

        {(selectedDays.length > 0 || time || fromAddress || toAddress) && (
          <>
            <Text className="font-psemibold mb-1">Zgjedhjet e deritanishme</Text>
            <View className="flex-row flex-wrap items-center gap-2">
              {selectedDays.length > 0 && (
                <View className="flex-row items-center gap-1">
                  <CalendarDays size={18} color={"#4f46e5"}/>
                  <Text className="text-indigo-600 text-sm font-psemibold">Ditët e zgjedhura</Text>
                </View>
              )}
              {time && (
                <View className="flex-row items-center gap-1">
                  <Clock size={18} color={"#dc2626"}/>
                  <Text className="text-red-600 text-sm font-psemibold">Koha e zgjedhur</Text>
                </View>
              )}
              {fromAddress && (
                <View className="flex-row items-center gap-1">
                  <LocationEdit size={18} color={"#ca8a04"}/>
                  <Text className="text-yellow-600 text-sm font-psemibold">Adresa nga</Text>
                </View>
              )}
              {toAddress && (
                <View className="flex-row items-center gap-1">
                  <LocationEdit size={18} color={"#16a34a"}/>
                  <Text className="text-green-600 text-sm font-psemibold">Adresa deri</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Save Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-indigo-600 py-3 rounded-xl mt-4"
          onPress={handleSave}
        >
          <Save size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Ruaj Rotacionin</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default CreateRotationForm;
