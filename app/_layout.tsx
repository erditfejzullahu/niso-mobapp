import { AuthProvider } from "@/context/AuthContext";
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from 'react-native-toast-message';
import "../assets/global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
      async function prepare() {
        try {
          
        } catch (error) {
          
        } finally {
          await SplashScreen.hideAsync();
        }
      }
      prepare()
    }
  }, [error, loaded])

  if(!loaded && !error){
    return null;
  }
  
  const queryClient = new QueryClient();

  return (
    <>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{flex: 1}}>
          <Stack screenOptions={{headerShown: false, gestureEnabled: true}}/>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </AuthProvider>
    
    <StatusBar style="dark"/>
    <Toast />
    </>
);
}
