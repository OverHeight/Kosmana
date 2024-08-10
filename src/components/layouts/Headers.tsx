import { Text, View } from "react-native";
import React from "react";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";

const Headers = () => {
  return (
    <View className="flex items-center justify-center px-4 pt-16 pb-2 bg-emerald-500">
      <View className="">
        <Text className="text-3xl text-white font-bold italic">Kosmana</Text>
      </View>
    </View>
  );
};

export default Headers;
