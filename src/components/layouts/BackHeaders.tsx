import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";

type Props = {
  judul: any;
  aksi?: any;
};

const BackHeaders: React.FC<Props> = ({ judul, aksi }) => {
  return (
    <View className="flex flex-row px-3 pt-14 pb-2 justify-between bg-emerald-500 sticky">
      <View className="w-[20%] items-start px-2 justify-center">
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <Entypo name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View className="w-[20%] justify-center items-center">
        <Text className="text-lg font-bold text-center text-white">
          {judul}
        </Text>
      </View>
      <View className="w-[20%] items-end px-2 justify-center">
        {aksi ? <View>{aksi}</View> : <Text></Text>}
      </View>
    </View>
  );
};

export default BackHeaders;
