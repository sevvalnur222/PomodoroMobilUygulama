import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Zamanlayıcı",
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Raporlar",
        }}
      />
    </Tabs>
  );
}
