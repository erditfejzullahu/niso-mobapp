import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "../assets/global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({
    "plight": Poppins_300Light,
    "pregular": Poppins_400Regular,
    "pmedium": Poppins_500Medium,
    "psemibold": Poppins_600SemiBold,
    "pbold": Poppins_700Bold,
    "pblack": Poppins_900Black
  })

  useEffect(() => {
    if(loaded || error){
      SplashScreen.hideAsync();
    }
  }, [error, loaded])

  if(!loaded && !error){
    return null;
  }
  

  return (
    <>
      <Stack screenOptions={{headerShown: false}}/>


      <StatusBar style="light"/>
    </>
);
}
