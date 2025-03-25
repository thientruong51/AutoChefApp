import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from "./src/context/CartContext";
import AppNavigator from "./src/navigation/AppNavigator";

// Cấu hình channel cho Android
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      if (!Device.isDevice) {
        Alert.alert("Thông báo", "Bạn cần sử dụng thiết bị thật để nhận thông báo!");
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert("Thông báo", "Bạn cần cấp quyền để nhận thông báo!");
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      console.log("Expo Push Token:", tokenData.data);
      setExpoPushToken(tokenData.data);
    };

    registerForPushNotificationsAsync();

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
      if (notification?.request?.content?.body) {
        Alert.alert("Thông báo", notification.request.content.body);
      }
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification opened:", response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </SafeAreaProvider>
  );
}
