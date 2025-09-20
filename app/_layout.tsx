import { AuthProvider } from "@/context/AuthContext";
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
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

      const toastConfig = {
      success: (props: any) => (
        <BaseToast
          {...props}
          style={{ height: 50, borderLeftColor: "#4f46e5" }} // Allows the toast to expand vertically
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            fontSize: 13,
            fontFamily: "psemibold",
            // Set numberOfLines for text1 if needed
            // text1NumberOfLines: 2,
          }}
          text2Style={{
            fontSize: 10,
            // Allow text2 to wrap to multiple lines
            text2NumberOfLines: 0, // 0 means unlimited lines
            fontFamily: 'plight'
          }}
        />
      ),
      error: (props: any) => (
        <ErrorToast
          {...props}
          style={{ height: 50, borderLeftColor: 'red' }} // Customize error style
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            fontSize: 13,
            letterSpacing: 0,
            fontFamily: "psemibold",
          }}
          text2Style={{
            fontSize: 10,
            text2NumberOfLines: 0,
            fontFamily: 'plight'
          }}
        />
      ),
      // Add other custom toast types if needed
    };
  
  const queryClient = new QueryClient();

  return (
    <>
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{headerShown: false, gestureEnabled: true}}/>
        </QueryClientProvider>
      </AuthProvider>
      
      <StatusBar style="dark"/>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
    </>
);
}
