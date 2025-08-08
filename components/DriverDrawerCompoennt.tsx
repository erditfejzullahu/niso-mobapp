import {
    DrawerContentScrollView,
    DrawerItemList
} from "@react-navigation/drawer";
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


export default function DriverDrawerComponent(props: any) {
  // Example logout function
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Add your logout logic here
          console.log("User logged out");
          // Example: props.navigation.replace("login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1">
    <View style={{ flex: 1 }}>
      {/* Scrollable area */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User profile */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: "https://randomuser.me/api/portraits/men/32.jpg",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>John Doe</Text>
        </View>

        {/* Drawer navigation items */}
        <View style={styles.drawerItems}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Logout button at bottom */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
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
    backgroundColor: "#4f46e5", // Indigo-600
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
  drawerItems: {
    flex: 1,
    paddingVertical: 10,
  },
  logoutSection: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  logoutButton: {
    backgroundColor: "#dc2626", // red-600
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
