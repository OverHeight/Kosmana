import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { countKosan } from "@/api/kosanAPI";
import { countKamar } from "@/api/kamarAPI";
import { countPenghuni } from "@/api/PenghuniAPI";

interface MenuItemProps {
  icon: JSX.Element;
  label: string;
  onPress: () => void;
}

interface StatCardProps {
  value: number | string;
  label: string;
  width?: string;
  aspectRatio?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity
    className="items-center justify-center h-24 w-[160px] p-1 mb-4 bg-white rounded-2xl shadow-sm shadow-black"
    onPress={onPress}
  >
    <View className="items-center">
      <View className="mb-1">{icon}</View>
      <Text className="text-sm text-emerald-500 font-semibold text-center">
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  width = "w-[48%]",
  aspectRatio = "aspect-square",
}) => (
  <View
    className={`${width} bg-emerald-500 rounded-3xl p-4 mb-4 items-center justify-center shadow-md ${aspectRatio}`}
  >
    <Text className="text-2xl font-bold text-white">{value}</Text>
    <Text className="text-sm text-white opacity-80 text-center mt-1">
      {label}
    </Text>
  </View>
);

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [counts, setCounts] = useState({
    kosan: 0,
    kamar: 0,
    penghuni: 0,
  });

  const fetchCounts = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCounts().then(() => setRefreshing(false));
  }, [fetchCounts]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#10b981" />
      <ScrollView
        className="flex-1 bg-gray-100"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#10b981"]}
          />
        }
      >
        <LinearGradient
          colors={["#10b981", "#059669"]}
          className="px-5 pt-12 pb-16 rounded-b-[30px]"
        >
          <Text className="text-3xl font-bold text-white">Kosmana</Text>
          <Text className="text-base text-white opacity-80">
            Manajemen Kost Mudah
          </Text>
        </LinearGradient>

        <View className="px-4 -mt-10">
          <View className="flex-row flex-wrap justify-between">
            <MenuItem
              icon={<AntDesign name="home" size={24} color="#10b981" />}
              label="Kost"
              onPress={() => router.navigate("/kost")}
            />
            <MenuItem
              icon={<Ionicons name="bed" size={24} color="#10b981" />}
              label="Kamar"
              onPress={() => router.navigate("/kamar/null")}
            />
            <MenuItem
              icon={<FontAwesome name="user" size={24} color="#10b981" />}
              label="Penghuni"
              onPress={() => router.navigate("/penghuni")}
            />
            <MenuItem
              icon={
                <MaterialCommunityIcons
                  name="dots-grid"
                  size={24}
                  color="#10b981"
                />
              }
              label="Lainnya"
              onPress={() => Alert.alert("Fitur belum tersedia")}
            />
          </View>
          <View className="bg-white rounded-3xl p-5 mb-6 shadow-md">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Selamat Datang!
            </Text>
            <Text className="text-base text-gray-500 font-medium">
              Kosmana adalah aplikasi yang mempermudah pendataan Kost Anda,
              membantu mengelola informasi penyewa dan kamar dengan efisien.
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            <StatCard value={counts.kosan} label="Jumlah Kosan" />
            <StatCard value={counts.kamar} label="Jumlah Kamar" />
            <StatCard
              value={counts.penghuni}
              label="Jumlah Penghuni"
              width="w-full h-[30%]"
              aspectRatio=""
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
