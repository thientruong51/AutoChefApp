import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from "./src/context/CartContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { Alert, Platform } from "react-native";
import * as Device from "expo-device";

export default function App() {
  useEffect(() => {
    const registerForPushNotifications = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      // Request for permission to receive push notifications
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Thông báo", "Bạn cần cấp quyền để nhận thông báo!");
        return;
      }

      // Get the token to send notifications to this device
      const tokenData = await Notifications.getExpoPushTokenAsync();
      console.log("Expo Push Token: ", tokenData.data);
    };

    registerForPushNotifications();

    // Handle notifications received while the app is in the foreground
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received:", notification);
      Alert.alert("Thông báo", notification.request.content.body);
    });

    // Handle notifications opened by the user (when the app is closed or in the background)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification opened:", response);
      // You can navigate or take action based on notification response
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
