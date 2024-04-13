import { Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

export default function Profile() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text>Open up App.js to start working on your appasd!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
