import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Text,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import BackHeaders from "@/components/layouts/BackHeaders";
import SearchBar from "@/components/SearchBar";
import PenghuniListItem from "@/components/Lists/PenghuniList";
import AddPenghuniModal from "@/components/Modal/AddPenghuniModal";
import ImageView from "react-native-image-viewing";
import { usePenghuniData } from "@/hooks/usePenghuniData";
import { PenghuniData } from "@/types/DBtypes";
import {
  useGetPenghuniKamarById,
  useGetPenghuniKamarByPenghuniId,
} from "@/api/Penghuni_KamarAPI";
import { Button } from "@rneui/base";

const Penghuni: React.FC = () => {
  const {
    loading,
    refreshing,
    filteredData,
    search,
    setSearch,
    refreshData,
    deletePenghuni,
    isModalVisible,
    isEditing,
    editData,
    toggleModal,
    handleSubmit,
    editPenghuni,
  } = usePenghuniData();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFotoVisible, setIsFotoVisible] = useState<boolean>(false);
  const [foto, setFoto] = useState<{ uri: string } | null>(null);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

  const handleMoreButton = useCallback(
    (id: number) => {
      Alert.alert("Pilih Tindakan!", "", [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus Penghuni",
          onPress: () => handleDeletePenghuni(id),
        },
        {
          text: "Edit Penghuni",
          onPress: () => editPenghuni(id),
        },
      ]);
    },
    [deletePenghuni, editPenghuni]
  );

  const handleDeletePenghuni = useCallback(
    async (id: number) => {
      try {
        // Check if the penghuni ID is attached to any Penghuni_Kamar records
        const penghunisKamar = await useGetPenghuniKamarByPenghuniId(id);

        if (penghunisKamar.length > 0) {
          // PenghuniId is attached to one or more Penghuni_Kamar records
          Alert.alert(
            "Tidak dapat menghapus",
            "Penghuni ini terhubung dengan kamar dan tidak dapat dihapus.",
            [{ text: "OK" }]
          );
          return;
        }

        // If not attached to any Penghuni_Kamar records, proceed with deletion
        Alert.alert(
          "Hapus Penghuni",
          "Apakah Anda yakin ingin menghapus penghuni ini?",
          [
            {
              text: "Batal",
              style: "cancel",
            },
            {
              text: "Hapus",
              onPress: () => {
                deletePenghuni(id);
                Alert.alert("Berhasil!", "Berhasil menghapus penghuni");
              },
            },
          ]
        );
      } catch (error) {
        console.error("Error checking Penghuni_Kamar:", error);
        Alert.alert("Error", "Terjadi kesalahan saat memeriksa data penghuni.");
      }
    },
    [deletePenghuni]
  );

  const handleFoto = useCallback((imageUri: string) => {
    setFoto({ uri: imageUri });
    setIsFotoVisible(true);
  }, []);

  const handleAddPress = useCallback(() => {
    console.log("Opening modal...");
    toggleModal(false);
    setIsModalLoading(true);

    setTimeout(() => {
      console.log("Modal loading complete.");
      setIsModalLoading(false);
    }, 100);
  }, [toggleModal]);

  // Memoize the filtered and sorted data
  const memoizedFilteredData = useMemo(() => {
    return Object.entries(filteredData).map(([key, items]) => (
      <View key={key}>
        {!search && (
          <Text className="px-4 py-2 bg-emerald-500 text-lg text-white font-bold">
            {key}
          </Text>
        )}
        {items.map((item: PenghuniData) => (
          <PenghuniListItem
            key={item.Id}
            item={item}
            onMorePress={handleMoreButton}
            onImagePress={handleFoto}
          />
        ))}
      </View>
    ));
  }, [filteredData, search, handleMoreButton, handleFoto]);

  const action = useMemo(
    () => (
      <Pressable onPress={handleAddPress}>
        <AntDesign name="plus" size={24} color="white" />
      </Pressable>
    ),
    [handleAddPress]
  );

  if (loading) {
    return (
      <SafeAreaProvider>
        <BackHeaders aksi={action} judul="Penghuni" />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#e5e7eb",
          }}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <BackHeaders aksi={action} judul="Penghuni" />
      <View className="bg-emerald-500">
        <SearchBar value={search} onChangeText={setSearch} />
      </View>
      <ScrollView
        className="flex-1 bg-gray-200 w-screen h-screen"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }
      >
        {memoizedFilteredData}
      </ScrollView>
      {isModalLoading ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <AddPenghuniModal
          visible={isModalVisible}
          toggleModal={() => toggleModal(false)}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          dataEdit={editData}
          onShow={() => setIsModalLoading(false)}
        />
      )}
      <ImageView
        images={foto ? [foto] : []}
        imageIndex={0}
        visible={isFotoVisible}
        onRequestClose={() => setIsFotoVisible(false)}
      />
    </SafeAreaProvider>
  );
};

export default Penghuni;
