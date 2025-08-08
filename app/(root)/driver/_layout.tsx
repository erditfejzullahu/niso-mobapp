// app/(drawer)/_layout.jsx
import DriverDrawerComponent from "@/components/DriverDrawerComponent";
import TopbarComponent from "@/components/TopbarComponent";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
