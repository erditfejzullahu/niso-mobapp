import { kosovoCities } from "@/data/kosovoCities";
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import * as Location from "expo-location";
import { debounce } from "lodash";
import { Euro, MapPin } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { MapPressEvent, Marker, UrlTile } from "react-native-maps";

export default function AddFixedTarif() {
  const [areaName, setAreaName] = useState("");
  
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [city, setCity] = useState(kosovoCities[0].label)

  const [areaData, setAreaData] = useState<any>(null)
  const [showAreaScroller, setShowAreaScroller] = useState(false)

  const [region, setRegion] = useState<{latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number} | null>(null)

  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);


  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setMarker(coordinate);
    // You can do more here — e.g., show modal, save coordinate, etc.
  };

  const getAreaNameData = async (areaName: string) => {
    try {
      const response = await axios.get(`https://photon.komoot.io/api/?q=${areaName}&lat=${region?.latitude}&lon=${region?.longitude}&limit=10`)
      
      console.log(response.data)
      setAreaData(response.data || null)
      setShowAreaScroller(true)
    } catch (error: any) {
      console.error(error.response.data);
      setAreaData(null)
      setShowAreaScroller(false)
    }
  }

  const handleGetAreaData = useCallback(
    debounce((areaName: string) => {
      getAreaNameData(areaName)
    }, 300), []
  )

  useEffect(() => {
    if(areaName.length > 0){
      handleGetAreaData(areaName)
    }
  }, [areaName])
  

  useEffect(() => {
    (async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission denied', 'Enable location permissions in settings.');
        return;
      }

      // Get current location
      let currentLocation = await Location.getCurrentPositionAsync({});

      setLocation(currentLocation);
      setRegion({latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude, longitudeDelta: 0.03, latitudeDelta: 0.03})
    })();
  }, []);

  const handleSubmit = () => {
    if (!areaName.trim()) {
      Alert.alert("Gabim", "Ju lutemi shkruani emrin e zonës.");
      return;
    }
    if (!location) {
      Alert.alert("Gabim", "Ju lutemi zgjidhni një lokacion në hartë.");
      return;
    }
    if (!price || Number(price) <= 0) {
      Alert.alert("Gabim", "Ju lutemi shkruani një çmim të vlefshëm.");
      return;
    }

    // Submit your form data here (e.g., API call)
    const fixedTarifData = {
      areaName,
      price: Number(price),
      description,
      location,
    };
    console.log("Fixed Tarif Data", fixedTarifData);
    Alert.alert("Sukses", "Tarifa u ruajt me sukses!");
    
    // Reset form
    setAreaName("");
    setPrice("");
    setDescription("");
    setLocation(null);
  };
  
  
  const onCityChange = (cityLabel: string) => {
    setCity(cityLabel);
    const city = kosovoCities.find((c) => c.label === cityLabel);
    if (city) {
      setRegion({
        longitude: city.longitude,
        latitude: city.latitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03
      })
    }
  };

  
  if (errorMsg) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if(!location) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size={'large'}/>
        <Text className="text-lg font-psemibold text-gray-500">Duke marrur lokacionin tuaj...</Text>
      </View>
    )
  }


  const { latitude, longitude } = location.coords;
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9fafb" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-indigo-900 font-psemibold text-2xl mb-6">
          Shto Tarifa të Fikse
        </Text>
        <View className="mb-4">
          <Text className="mb-1 text-gray-700 font-pmedium">Qyteti</Text>
          <Picker
            selectedValue={city}
            onValueChange={onCityChange}
            style={{backgroundColor: "white"}}
          >
            {kosovoCities.map((city) => (
              <Picker.Item key={city.label} label={city.label} value={city.label} />
            ))}
          </Picker>
        </View>
        {/* Area Name */}
        <View className="mb-4">
          <Text className="mb-1 text-gray-700 font-pmedium">Emri i zonës/lagjës</Text>
          <TextInput
            editable={!!city}
            placeholder="Shembull: Bregu i Diellit"
            className={`bg-white rounded-2xl px-4 py-3 shadow-sm shadow-black/10 border border-gray-200 ${!city && "!bg-gray-200"}`}
            value={areaName}
            onChangeText={setAreaName}
          />
          {showAreaScroller && <ScrollView className="rounded-xl p-2 bg-white mt-2 max-w-[200px] max-h-[100px] border border-gray-200">
            {areaData && areaData?.features?.map((item: any, idx: number) => (
              <TouchableOpacity key={idx} onPress={() => {setRegion({latitude: item.geometry.coordinates[1], longitude: item.geometry.coordinates[0], longitudeDelta: 0.003, latitudeDelta: 0.003}); setAreaName(item.properties.name); setShowAreaScroller(false)}}>
                <Text className="text-gray-500 py-1 border-b border-gray-200 font-pmedium text-sm">{item.properties.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>}
        </View>

        {/* Price */}
        <View className="mb-4">
          <Text className="mb-1 text-gray-700 font-pmedium">Çmimi (€)</Text>
          <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm shadow-black/10 border border-gray-200">
            <Euro size={20} color="#4338ca" />
            <TextInput
              keyboardType="numeric"
              placeholder="Shembull: 5.00"
              className="ml-3 flex-1 text-gray-700 font-pregular"
              value={price}
              onChangeText={setPrice}
            />
          </View>
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className="mb-1 text-gray-700 font-pmedium">Shënime (opsionale)</Text>
          <TextInput
            placeholder="Opsionale: Përshkrim ose detaje shtesë"
            className="bg-white rounded-2xl px-4 py-3 shadow-sm shadow-black/10 border border-gray-200"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Location Picker */}
        <View className="mb-4">
          <Text className="mb-1 text-gray-700 font-pmedium flex-row items-center">
            <MapPin size={18} color="#4338ca"/>
            <Text className="ml-1">Verifikoni Lokacionin në Hartë</Text>
          </Text>
          <View className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm shadow-black/10 h-64 mt-2">
            <MapView
              region={{latitude: region ? region.latitude : latitude, longitude: region ? region.longitude : longitude, latitudeDelta: region ? region.latitudeDelta : 0.003, longitudeDelta: region ? region.longitudeDelta : 0.003}}
              style={{ flex: 1 }}
              onPress={handleMapPress}
              loadingEnabled
              showsUserLocation
            >
              <UrlTile
                urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
              />
              {marker && <Marker coordinate={marker} title="Zona e zgjedhur" />}
            </MapView>

          </View>
          {!location && (
            <Text className="text-red-500 mt-1 text-xs font-pmedium">
              Ju lutemi shtypni në hartë për të vendosur zonën.
            </Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-indigo-600 py-3 rounded-2xl shadow-md shadow-indigo-700/30 mt-6"
        >
          <Text className="text-white font-psemibold text-center text-lg">
            Ruaj Tarifën
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
