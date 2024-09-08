import React, { useEffect, useState } from "react";
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
import { AntDesign, Entypo } from "@expo/vector-icons";
import BackHeaders from "@/components/layouts/BackHeaders";
import KamarList from "@/components/Lists/KamarList";
import { useKamarData } from "@/hooks/useKamarData";
import { router, useLocalSearchParams } from "expo-router";
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
    dataLoaded,
    onRefresh,
    setKosan,
  } = useKamarData();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    console.log("Id: ", Number(id));
    if (!isNaN(Number(id))) {
      setKosan(Number(id));
    }
  }, []);

  const handleAddKamar = async () => {
    if (kosan === 0 || null) {
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
      if (error instanceof Error) {
        if (
          error.message === "Cannot delete Kamar with existing transactions"
        ) {
          Alert.alert(
            "Tidak dapat menghapus",
            "Kamar ini memiliki transaksi yang terkait dan tidak dapat dihapus."
          );
        } else {
          console.error("Error deleting Kamar:", error);
          Alert.alert(
            "Error",
            "Terjadi kesalahan saat menghapus kamar. Silakan coba lagi nanti."
          );
        }
      } else {
        console.error("Unknown error:", error);
        Alert.alert(
          "Error",
          "Terjadi kesalahan yang tidak diketahui. Silakan coba lagi nanti."
        );
      }
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
      "Apakah Anda ingin Mengedit Kamar atau Menghapus kamar?",
      [
        {
          text: "Edit Kamar",
          onPress: () => handleEditKamar(kamarId),
        },
        {
          text: "Hapus Kamar",
          onPress: () => handleDeleteKamar(kamarId, Number(kosan)),
        },
        { text: "Batal" },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <BackHeaders judul={"Kamar"} />
        <View className="flex-1 bg-white justify-center items-center">
          <ActivityIndicator size="large" color="#7CFC00" />
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
                    value={null}
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
        {dataLoaded ? (
          kosan !== null ? (
            <KamarList
              listPenghuniKamar={listPenghuniKamar}
              onDotPress={handleDots}
            />
          ) : (
            <View className="flex-1 my-6 justify-center p-2 items-center">
              <View className="flex bg-emerald-500 p-4 rounded-lg gap-y-2 justify-center items-center">
                <AntDesign
                  name="caretcircleoup"
                  size={24}
                  color="white"
                  className="self-center"
                />
                <Text className="text-lg font-bold text-white text-center mb-2">
                  Silahkan Pilih Kosan Terlebih Dahulu!
                </Text>
              </View>
            </View>
          )
        ) : (
          <Text>Loading!!</Text>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default Kamar;
