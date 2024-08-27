import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Entypo } from "@expo/vector-icons";
import BackHeaders from "@/components/layouts/BackHeaders";
import KamarList from "@/components/Lists/KamarList";
import { useKamarData } from "@/hooks/useKamarData";
import { router } from "expo-router";
import { useCreateKamar, useDeleteKamar } from "@/api/kamarAPI";

const Kamar = () => {
  const [pilihKosan, setPilihKosan] = useState<boolean>(true);
  const {
    listKamar,
    listPenghuniKamar,
    listKosan,
    kosan,
    loading,
    refreshing,
    onRefresh,
    setKosan,
  } = useKamarData();

  const handleAddKamar = async () => {
    if (kosan === 0) {
      Alert.alert("Gagal", "Pilih kamar terlebih dahulu!");
      return null;
    }
    try {
      const newKamar = { KosanId: Number(kosan), NoKam: listKamar.length + 1 };
      await useCreateKamar(newKamar);
      Alert.alert("Sukses", "Sukses menambahkan kamar di kosan");
      onRefresh(); // Refresh data after adding a kamar
    } catch (error) {
      Alert.alert("Error", "Gagal menambahkan Kamar");
    }
  };

  const handleEditKamar = async (id: number) => {
    try {
      router.navigate("/kamar/editKamar/" + id);
    } catch (error) {
      console.error("Error navigating to editKamar:", error);
    }
  };

  const handleDeleteKamar = async (id: number, kosanId: number) => {
    try {
      await useDeleteKamar(id, kosanId);
      Alert.alert("Sukses", "Kamar telah dihapus");
      onRefresh(); // Refresh data after deleting a kamar
    } catch (error) {
      Alert.alert("Error", "Error Sistem!");
    }
  };

  const handlekosan = (value: number | string | null) => {
    const kosanId = Number(value);
    if (value !== 0) {
      setKosan(kosanId);
      setPilihKosan(false);
    } else if (pilihKosan) {
      setKosan(kosanId);
    }
  };

  const handleDots = (kamarId: number) => {
    Alert.alert(
      "Pilih tindakan",
      "Apakah Anda ingin menghapus kamar atau kamar?",
      [
        {
          text: "Edit Kamar",
          onPress: () => handleEditKamar(kamarId),
        },
        {
          text: "Hapus Kamar",
          onPress: () => handleDeleteKamar(kamarId, Number(kosan)),
        },
        { text: "Cancel" },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <BackHeaders judul={"Kamar"} />
        <View className="flex-1 bg-white justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <BackHeaders judul={"Kamar"} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1 bg-white"
      >
        {listKosan.length <= 0 ? (
          <Text className="text-lg text-center font-bold text-red-500 my-5">
            Tambahkan kosan terlebih dahulu!
          </Text>
        ) : (
          <View className="w-full bg-emerald-600 p-2">
            <View className="flex-row justify-between items-center">
              <View className="flex-1 mr-2">
                <Picker
                  selectedValue={kosan}
                  onValueChange={(value) => handlekosan(value)}
                  style={{
                    color: "white",
                    backgroundColor: "rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{
                    color: "white",
                  }}
                >
                  <Picker.Item
                    label="Pilih Kosan"
                    enabled={pilihKosan}
                    value={0}
                  />
                  {listKosan.map((e) => (
                    <Picker.Item
                      key={e.Id}
                      label={e.NamaKosan}
                      value={e.Id}
                      color="black"
                    />
                  ))}
                </Picker>
              </View>
              <Pressable
                onPress={handleAddKamar}
                className="h-10 w-10 justify-center items-center bg-emerald-500 rounded-full"
              >
                <Entypo name="plus" size={24} color="white" />
              </Pressable>
            </View>
          </View>
        )}
        {kosan ? (
          <KamarList
            listPenghuniKamar={listPenghuniKamar}
            onDotPress={handleDots}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg font-semibold">
              Silakan Pilih kosan terlebih dahulu!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default Kamar;
