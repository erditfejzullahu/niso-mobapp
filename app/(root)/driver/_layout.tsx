// app/(drawer)/_layout.jsx
import DriverDrawerComponent from "@/components/DriverDrawerCompoennt";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <DriverDrawerComponent {...props}/>} screenOptions={{drawerPosition: "right"}}>
        <Drawer.Screen 
            name="active-routes"
            options={{drawerLabel: "Ballina"}}
        />
        <Drawer.Screen 
            name="regular-clients"
            options={{drawerLabel: "Klientë të rregullt"}}
        />
        <Drawer.Screen 
            name="add-fixed-tarif"
            options={{drawerLabel: "Shto tarifë fikse"}}
        />
        <Drawer.Screen 
            name="statistics"
            options={{drawerLabel: "Fitimet tua"}}
        />
        <Drawer.Screen 
            name="profile"
            options={{drawerLabel: "Profili juaj"}}
        />
        <Drawer.Screen 
            name="section"
            options={{drawerItemStyle: {display: "none"}}}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
