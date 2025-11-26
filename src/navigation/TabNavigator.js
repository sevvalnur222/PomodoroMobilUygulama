import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import DashboardScreen from "../screens/DashboardScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Zamanlayıcı" component={HomeScreen} />
      <Tab.Screen name="Raporlar" component={DashboardScreen} />
    </Tab.Navigator>
  );
}
