import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginTop: 3
        },
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0,
          shadowColor: "rgba(0,0,0,0.3)",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -3 },
          shadowRadius: 6,
          elevation: 6,
          position: "absolute",
        },
        tabBarActiveTintColor: route.name === "active-routes" ? "#4f46e5" : "#4f46e5", // indigo-600
        tabBarInactiveTintColor: "#9ca3af",
        tabBarIcon: ({ color, size, focused }) => {
          const scaleAnim = useRef(new Animated.Value(1)).current;

          useEffect(() => {
            Animated.spring(scaleAnim, {
              toValue: focused ? 1.2 : 1,
              friction: 4,
              useNativeDriver: true,
            }).start();
          }, [focused]);

          let icon;
          switch (route.name) {
            case "active-routes":
                icon = <Ionicons name="home" color={color} size={size}/>
                break;
            case "regular-clients":
                icon = <Ionicons name="people-circle-sharp" color={color} size={size}/>
                break;
            case "statistics":
                icon = <FontAwesome6 name="money-check-dollar" size={size} color={color} />
                break;
            case "profile":
                icon = <Fontisto name="person" size={size} color={color} />
                break;
            default:
                icon = <Ionicons name="ellipse" color={color} size={size}/>
                break;
          }

          return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              {icon}
            </Animated.View>
          );
        },
      })}
    >
      {/* Home */}
      <Tabs.Screen name="active-routes" options={{tabBarLabel: "Ballina"}}/>

      {/* Search */}
      <Tabs.Screen name="regular-clients" options={{tabBarLabel: "Klientë"}}/>

      {/* Floating Add Button */}
      <Tabs.Screen
        name="add-fixed-tarif"
        options={{
          tabBarButton: ({ onPress }) => <FloatingButton onPress={onPress} />,
        }}
      />

      {/* Statistics */}
      <Tabs.Screen name="statistics" options={{tabBarLabel: "Fitimet"}} />

      {/* Profile */}
      <Tabs.Screen name="profile" options={{tabBarLabel: "Profili"}}/>

      <Tabs.Screen name="view-tarifs" options={{href: null}} />
    </Tabs>
  );
}

// Floating + Button with Bounce Animation
function FloatingButton({ onPress }: {onPress: any}) {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.floatingButtonContainer}>
      <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.floatingButton}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: "#4f46e5", // indigo-600
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
