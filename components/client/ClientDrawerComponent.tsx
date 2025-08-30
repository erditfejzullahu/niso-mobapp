import { useAuth } from "@/context/AuthContext";
import api from "@/hooks/useApi";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname } from "expo-router";
import { UserStar } from "lucide-react-native";
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
import Toast from "react-native-toast-message";

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

export default function ClientDrawerComponent(props: any) {
  const {user, updateSession} = useAuth();

  if(!user) {router.replace('/sign-in'); return;}

  const pathname = usePathname();
  const {logout} = useAuth();

  const handleLogout = () => {
    Alert.alert("Shkycje", "A jeni të sigurt që dëshironi të shkyceni?", [
      { text: "Mbyll", style: "cancel" },
      {
        text: "Shkycuni",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  const drawerItems = [
    {
      route: "client-home",
      label: "Ballina",
      icon: (color: string, size: number) => (
        <MaterialIcons name="dashboard" size={size} color={color} />
      ),
    },
    {
      route: "niso-drivers",
      label: "Shoferët e Niso.",
      icon: (color: string, size: number) => (
        <FontAwesome name="drivers-license" size={size} color={color} />
      ),
    },
    {
      route: "create-rotation",
      label: "Shtoni rotacion",
      icon: (color: string, size: number) => (
        <Ionicons name="pricetag" size={size} color={color} />
      ),
    },
    {
      route: "default-rotations",
      label: "Të gjithë rotacionet",
      icon: (color: string, size: number) => (
        <Ionicons name="pricetags" size={size} color={color} />
      )
    },
    {
      route: "favorite-drivers",
      label: "Shoferët e preferuar",
      icon: (color: string, size: number) => (
        <UserStar color={color} size={size}/>
      )
    },
    {
      route: "expenses",
      label: "Shpenzimet tuaja",
      icon: (color: string, size: number) => (
        <Ionicons name="stats-chart" size={size} color={color} />
      ),
    },
    {
      route: "client-profile",
      label: "Profili juaj",
      icon: (color: string, size: number) => (
        <Ionicons name="person-circle" size={size} color={color} />
      ),
    },
  ];

  
  const handleImageUpload = async () => {
      const {status} = await ImagePicker.getMediaLibraryPermissionsAsync()
      console.log(status);
      
      if(status !== "granted" && status !== "undetermined"){
        Toast.show({
          type: "error",
          text1: "Ju duhet të keni leje të hapjes së galerisë"
        })
      }
  
      const imagePicked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 0.7,
        aspect: [1,1]
      })
  
      if(!imagePicked.canceled){
        const imageUri = imagePicked.assets[0].uri  
        const formData = new FormData();
        const filename = imageUri.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('newProfileImage', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
        const res = await api.post('/auth/update-profile-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if(res.data.success){
          const uptdSession = await updateSession();
          if(uptdSession){
            Toast.show({
              type: "success",
              text1: "Sukes!",
              text2: "Sapo ndryshuat me sukses foton e profilit."
            })
          }else{
            Toast.show({
              type: "info",
              text1: "Informacion",
              text2: "Sesioni nuk u perditesua. Deri ne kycjen tjeter fotoja e ngarkuar nuk do paraqitet tek ju."
            })
          }
        }
      }
    }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View style={{ flex: 1 }} >
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User profile with gradient */}
          <LinearGradient
            colors={["#4f46e5", "#4f46e5", "#4f46e5"]} // multiple indigo tones
            start={{ x: 0, y: 1.5 }}
            end={{ x: 1, y: 1.5 }}
            style={styles.profileSection}
          >
            <TouchableOpacity onPress={handleImageUpload}>
              <Image
                source={{ uri: user.image }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <Text style={styles.profileName}>John Doe</Text>
            <Text className="text-white font-pregular text-sm">Shofer</Text>
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
                  onPress={() => router.push('/(root)/client/section/' + item.route as unknown as any)}
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
            className="!bg-red-600"
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
    fontFamily: "pbold"
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
    backgroundColor: "#4f46e5",
  },
  iconContainer: {
    width: 30,
    alignItems: "center",
  },
  drawerLabel: {
    fontSize: 16,
    fontFamily: "psemibold",
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
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  logoutText: {
    color: "#fff",
    fontFamily: "pregular",
    fontSize: 16,
  },
});