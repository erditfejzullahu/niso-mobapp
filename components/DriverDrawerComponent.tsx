import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DrawerItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
}

const CustomDrawerItem = ({ label, icon, isActive, onPress }: DrawerItemProps) => (
  <TouchableOpacity
    style={[
      styles.drawerItem,
      isActive && styles.activeDrawerItem
    ]}
    onPress={onPress}
  >
    <View style={styles.iconContainer}>
      {icon}
    </View>
    <Text style={[
      styles.drawerLabel,
      isActive && styles.activeDrawerLabel
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function DriverDrawerComponent(props: any) {
  const pathname = usePathname();
  
  
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("User logged out"),
      },
    ]);
  };

  const drawerItems = [
    {
      route: "active-routes",
      label: "Ballina",
      icon: (color: string, size: number) => (
        <MaterialIcons name="dashboard" size={size} color={color} />
      ),
    },
    {
      route: "regular-clients",
      label: "Klientë të rregullt",
      icon: (color: string, size: number) => (
        <FontAwesome5 name="users" size={size} color={color} />
      ),
    },
    {
      route: "add-fixed-tarif",
      label: "Shto tarifë fikse",
      icon: (color: string, size: number) => (
        <Ionicons name="pricetag" size={size} color={color} />
      ),
    },
    {
      route: "view-tarifs",
      label: "Shiko tarifat tua",
      icon: (color: string, size: number) => (
        <Ionicons name="pricetags" size={size} color={color} />
      )
    },
    {
      route: "statistics",
      label: "Fitimet tua",
      icon: (color: string, size: number) => (
        <Ionicons name="stats-chart" size={size} color={color} />
      ),
    },
    {
      route: "profile",
      label: "Profili juaj",
      icon: (color: string, size: number) => (
        <Ionicons name="person-circle" size={size} color={color} />
      ),
    },
  ];

  return (
    <SafeAreaView className="flex-1">
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User profile with gradient */}
          <LinearGradient
            colors={["#312e81", "#4f46e5", "#312e81"]} // multiple indigo tones
            start={{ x: 0, y: 1.5 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileSection}
          >
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>John Doe</Text>
          </LinearGradient>

          {/* Custom Drawer Items */}
          <View style={styles.drawerItemsContainer}>
            {drawerItems.map((item) => {
              const isActive = pathname.includes(item.route);
              return (
                <CustomDrawerItem
                  key={item.route}
                  label={item.label}
                  icon={item.icon(
                    isActive ? "#fff" : "#94A3B8",
                    24
                  )}
                  isActive={isActive}
                  onPress={() => router.push(`/(root)/driver/section/${item.route}` as unknown as any)}
                />
              );
            })}
          </View>
        </DrawerContentScrollView>

        {/* Logout button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Shkycuni</Text>
            <AntDesign name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 10,
  },
  profileSection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
  },
  profileName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  drawerItemsContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginVertical: 4,
  },
  activeDrawerItem: {
    backgroundColor: "#4F46E5",
  },
  iconContainer: {
    width: 30,
    alignItems: "center",
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 15,
    color: "#94A3B8",
  },
  activeDrawerLabel: {
    color: "#fff",
  },
  logoutSection: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});