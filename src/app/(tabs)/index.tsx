import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Headers from "@/components/layouts/Headers";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { RefreshControl } from "react-native";
import { countKosan } from "@/api/kosanAPI";
import { countKamar } from "@/api/kamarAPI";
import { countPenghuni } from "@/api/PenghuniAPI";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [counts, setCounts] = React.useState({
    kosan: 0,
    kamar: 0,
    penghuni: 0,
  });

  React.useEffect(() => {
    const fetchCounts = async () => {
      const [kosanCount, kamarCount, penghuniCount] = await Promise.all([
        countKosan(),
        countKamar(),
        countPenghuni(),
      ]);

      setCounts({
        kosan: kosanCount as number,
        kamar: kamarCount as number,
        penghuni: penghuniCount as number,
      });
    };

    fetchCounts();
  }, [counts, refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaProvider>
      <Headers />
      <ScrollView
        className="flex-1 bg-gray-200"
        refreshControl={
          <RefreshControl
            className="bg-emerald-500"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View className="flex-1">
          <View className="flex-col bg-emerald-500 relative">
            <View className="flex-row justify-evenly p-2 pt-5 pb-12 bg-emerald-500">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.navigate("/kost")}
                className="justify-center items-center gap-1"
              >
                <View className="bg-emerald-500 rounded-full p-2 border border-white ">
                  <View className="h-9 w-9 justify-center items-center">
                    <AntDesign name="home" size={32} color="white" />
                  </View>
                </View>
                <Text className="text-white">Kost</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.navigate("/kamar")}
                className="justify-center items-center gap-1"
              >
                <View className="bg-emerald-500 rounded-full p-2 border border-white ">
                  <View className="h-9 w-9 justify-center items-center">
                    <Ionicons name="bed" size={32} color="white" />
                  </View>
                </View>
                <Text className="text-white">Kamar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.navigate("/penghuni")}
                className="justify-center items-center gap-1"
              >
                <View className="bg-emerald-500 rounded-full p-2 border border-white ">
                  <View className="h-9 w-9 justify-center items-center">
                    <FontAwesome name="user" size={32} color="white" />
                  </View>
                </View>
                <Text className="text-white">Penghuni</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Fitur belum ada",
                    "Maaf sekali fitur ini belum ada"
                  )
                }
                className="justify-center items-center gap-1"
              >
                <View className="bg-emerald-500 rounded-full p-2 border border-white ">
                  <View className="h-9 w-9 justify-center items-center">
                    <MaterialCommunityIcons
                      name="dots-grid"
                      size={32}
                      color="white"
                    />
                  </View>
                </View>
                <Text className="text-white">Lainnya</Text>
              </TouchableOpacity>
            </View>
            <View className="flex justify-center bg-gray-200 pt-1 pb-4 mt-28 absolute left-6 right-6 rounded-lg border border-gray-400">
              <View className="my-2 p-4">
                <Text className="text-2xl font-bold">Selamat Datang!</Text>
              </View>
              <View className="flex-row justify-between mx-5">
                <View>
                  <View>
                    <Text className="text-lg font-medium">
                      Kosmana adalah aplikasi Kost untuk mempermudah pendataan
                      Kost Anda
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="flex mt-24">
          <View className="mt-16">
            <View className="my-2">
              <View className="flex-row justify-evenly">
                <View className="bg-emerald-200 rounded-3xl p-4 gap-y-6 w-[42%] h-max justify-center items-center ">
                  <View className="justify-center items-center">
                    <Text className="font-bold text-6xl">{counts.kosan}</Text>
                  </View>
                  <View>
                    <Text className="text-md font-medium">jumlah kosan</Text>
                  </View>
                </View>
                <View className="bg-emerald-200 rounded-3xl p-4 gap-y-6 w-[42%] h-max justify-center items-center ">
                  <View className="justify-center items-center">
                    <Text className="font-bold text-6xl">{counts.kamar}</Text>
                  </View>
                  <View>
                    <Text className="text-md font-medium">jumlah kamar</Text>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View className="flex flex-row m-5 p-6 bg-emerald-200 rounded-3xl justify-around items-center">
                <View className="justify-center items-center">
                  <Text className="font-bold text-6xl">{counts.penghuni}</Text>
                </View>
                <View>
                  <Text className="text-md font-medium">Jumlah Penghuni</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
