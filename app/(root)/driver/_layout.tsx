// app/(drawer)/_layout.jsx
import ConversationsComponent from "@/components/ConversationsComponent";
import DriverDrawerComponent from "@/components/DriverDrawerComponent";
import NotificationsComponent from "@/components/NotificationsComponent";
import TopbarComponent from "@/components/TopbarComponent";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  const router = useRouter();
  const {user, loading} = useAuth();
  
  useEffect(() => {
    if(!loading){
      if(!user){
        router.replace('/(auth)/sign-in')
      }
      if(user && !user.user_verified){
        router.replace('/verify-identity')
      }
      if(user && user.role !== "DRIVER"){
        router.replace('/(root)/client/section/client-home')
      }
    }  
  }, [user, loading])
  
  return (
    <>
      <Drawer
        drawerContent={(props) => <DriverDrawerComponent {...props} />}
        screenOptions={{
          // headerShown: false,
          header: ({navigation}) => <TopbarComponent navigation={navigation}/>,
          drawerPosition: "right",
          drawerActiveBackgroundColor: "#4F46E5", // Indigo
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#94A3B8", // Slate gray
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: "600",
            marginLeft: -10,
            fontFamily: "pblack"
          },
          drawerItemStyle: {
            borderRadius: 12,
            marginVertical: 6,
            paddingVertical: 4,
          },
        }}
        
      >
        <Drawer.Screen
          name="section"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />
      </Drawer>
      <NotificationsComponent />
      <ConversationsComponent />
    </>
  );
}


