import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Text, Provider as PaperProvider } from 'react-native-paper';
import theme from "./theme";
import AppLoading from "expo-app-loading";

import {useFonts} from "expo-font";
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import TransfersScreen from "./screens/TransfersScreen";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HistoryScreen from "./screens/HistoryScreen";
import CurrencyScreen from "./screens/CurrencyScreen";
import AccountScreen from "./screens/AccountScreen";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import Colors from "./constants/colors";
// import {Icon} from "react-native-vector-icons/Icon";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic
} from '@expo-google-fonts/roboto';
import {Entypo, Fontisto} from "@expo/vector-icons";
import {createNativeStackNavigator} from "@react-navigation/native-stack";



const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const NavigationContainerTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.MAIN_BACKGROUND
  },
};

const MainNavigationTabs = () => {
  return (
    <Tab.Navigator tabBarPosition='bottom' screenOptions={{
      tabBarShowLabel: true,
      tabBarLabelStyle: { fontSize: 12 },
      tabBarShowIcon: true,
      swipeEnabled: false,
      tabBarStyle: { backgroundColor: Colors.MAIN_NAVIGATION_BACKGROUND },
      tabBarActiveTintColor: Colors.PRIMARY,
      tabBarInactiveTintColor: Colors.NAVIGATION_INACTIVE_TEXT
    }}
    >
      <Tab.Screen name="Transfers" component={TransfersScreen} options={{
        tabBarLabel: 'TRANSFERS',
        tabBarIcon: ({ color }) => (
          <Entypo name="swap" color={color} size={24} style={styles.tabIcon} />
        ),
      }}/>
      <Tab.Screen name="History" component={HistoryScreen} options={{
        tabBarLabel: 'HISTORY',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="history" color={color} size={26} style={styles.tabIcon} />
        ),
      }}/>
      <Tab.Screen name="Exchanges" component={CurrencyScreen} options={{
        tabBarLabel: 'EXCHANGES',
        tabBarIcon: ({ color }) => (
          // <Fontisto name="dollar" color={color} size={26} style={styles.tabIcon} />
          <Text style={[styles.tabLetterIcon, { color: color }]}>$</Text>
        ),
      }}/>
      <Tab.Screen name="Account" component={AccountScreen} options={{
        tabBarLabel: 'ACCOUNT',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account-circle" color={color} size={26} style={styles.tabIcon} />
        ),
      }}/>
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'roboto-bold': Roboto_700Bold,
    'roboto-medium': Roboto_500Medium,
    'roboto': Roboto_400Regular,
    'roboto-light': Roboto_300Light,
    'roboto-thin': Roboto_100Thin,
  })

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <PaperProvider theme={theme}>
      {/*removed saveAreaProvider (safeAreaView provided by default with stack header). If headerVisible=false, then provide safeAreaView explicitly*/}
      <StatusBar style="dark" />
        <NavigationContainer theme={NavigationContainerTheme}>
          <Stack.Navigator>
            <Stack.Screen name="TabsMain" component={MainNavigationTabs} />
          </Stack.Navigator>
        </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    textAlign: 'center'
  },
  tabLetterIcon: {
    textAlign: 'center',
    fontSize: 23,
    fontWeight: "400",
    height: 30,
    position: 'relative',
    bottom: 2.5
  }
});
