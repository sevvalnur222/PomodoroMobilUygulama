import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000000", // alt bar siyah
        },
        tabBarActiveTintColor: "#3b82f6", // aktif mavi
        tabBarInactiveTintColor: "#9ca3af", // pasif gri
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Zamanlayıcı",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Raporlar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
