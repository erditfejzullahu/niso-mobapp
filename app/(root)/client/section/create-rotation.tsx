import HeaderComponent from "@/components/HeaderComponent";
import api from "@/hooks/useApi";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { CalendarDays, Clock, LocationEdit, MapPin, Save } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";


const CreateRotationForm = () => {
  const {rotation} = useLocalSearchParams();
  
  const queryClient = useQueryClient();

  const daysOfWeek = useMemo(() => ([
    { label: "E Hënë", value: "MONDAY" },
    { label: "E Martë", value: "TUESDAY" },
    { label: "E Mërkurë", value: "WEDNESDAY" },
    { label: "E Enjte", value: "THURSDAY" },
    { label: "E Premte", value: "FRIDAY" },
    { label: "E Shtunë", value: "SATURDAY" },
    { label: "E Diel", value: "SUNDAY" },
  ]), []);

  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [time, setTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if(rotation){
      try {
        const parsedRotation = JSON.parse(rotation as string)
        if(parsedRotation?.time){
          const [hours, minutes] = parsedRotation.time.split(':').map(Number);
          const newDate = new Date();
          newDate.setHours(hours)
          newDate.setMinutes(minutes)
          newDate.setSeconds(0)
          newDate.setMilliseconds(0)
          setTime(newDate)
        }else{
          setTime(null)
        }
        setFromAddress(parsedRotation.fromAddress)
        setToAddress(parsedRotation.toAddress)
        setSelectedDays(parsedRotation.days || [])
      } catch (error) {
        console.error("error parsing, ", error);
      }
    }
    
  }, [rotation])
  
  //when user gets out of the screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        setFromAddress("")
        setToAddress("")
        setSelectedDays([])
        setTime(null)
      }
    }, [])
  )

  const toggleDay = useCallback((day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }, [setSelectedDays]);

  const handleSave = async () => {
    if((!fromAddress || fromAddress.length < 3) || (!toAddress || toAddress.length < 3) || (selectedDays.length === 0) || (!time)){
      Toast.show({
        type: "error",
        text1: "Gabim",
        text2: "Ju lutem mbushini te gjitha fushat"
      })
      return;
    }
    const newRotation = { fromAddress, toAddress, days: selectedDays, pickupTime: time };
    try {
      const res = await api.post('/passengers/create-rotation', newRotation);
      if(res.data.success){
        Toast.show({
          type: "success",
          text1: "Sukses",
          text2: "Sapo keni shtuar rotacion me sukses."
        })
        setFromAddress("");
        setToAddress("");
        setSelectedDays([]);
        setTime(null);
        queryClient.invalidateQueries({queryKey: ['default-rotations']});
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Gabim",
        text2: error.response.data.message || "Dicka shkoi gabim. Ju lutem provoni perseri."
      })
    }
  };



  return (
    <KeyboardAwareScrollView className="p-4 bg-gray-50">
      <HeaderComponent title={rotation ? "Rifresko rotacion" : "Krijo rotacion"} subtitle={
        rotation
        ? "Rifreskoni rotacionin duke ndryshuar fushat e mëposhtme sipas nevojave tua personale. Në fund klikoni 'Rifresko Rotacionin'."
        : "Këtu mund të shtoni rotacione që mund t'i përdorni për të lidhur 'Kontratë' me shoferët e Niso. P.sh. nga puna në banesë."
        }/>

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
              activeOpacity={1}
              key={day.value}
              className={`px-3 py-2 rounded-xl border ${
                selectedDays.includes(day.value)
                  ? "bg-indigo-600 border-indigo-600"
                  : "bg-indigo-100 border-indigo-300"
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
          <Text className="font-semibold text-gray-700 mb-1">Ora</Text>
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
              locale='sq-AL'
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
          <Text className="text-white font-semibold ml-2">{rotation ? "Rifresko Rotacionin" : "Ruaj Rotacionin"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default CreateRotationForm;
