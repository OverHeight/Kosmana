import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Text,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import BackHeaders from "@/components/layouts/BackHeaders";
import SearchBar from "@/components/SearchBar";
import PenghuniListItem from "@/components/Lists/PenghuniList";
import AddPenghuniModal from "@/components/Modal/AddPenghuniModal";
import { usePenghuniData } from "@/hooks/usePenghuniData";
import { PenghuniData } from "@/types/DBtypes";
import {
  useCreatePenghuni,
  useDeletePenghuni,
  useGetPenghuniById,
  useUpdatePenghuni,
} from "@/api/PenghuniAPI";
import ImageView from "react-native-image-viewing";

const Penghuni = () => {
  const [search, setSearch] = useState<string>("");
  const [isModalOn, setModalOn] = useState<boolean>(false);
  const [isFotoVisible, setIsFotoVisible] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<Partial<PenghuniData> | null>(null);
  const [foto, setFoto] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const [refreshing, setRefreshing] = useState<boolean>(false); // Refreshing state
  const penghuni = usePenghuniData();

  const handleMoreButton = (id: number) => {
    Alert.alert("Pilih Tindakan!", "", [
      {
        text: "Batal",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Hapus Penghuni",
        onPress: async () => {
          setLoading(true);
          try {
            await useDeletePenghuni(id);
            onRefresh(); // Refresh data after deletion
          } catch (error) {
            Alert.alert("Error", "Gagal menghapus penghuni");
          } finally {
            setLoading(false);
          }
        },
      },
      {
        text: "Edit Penghuni",
        onPress: async () => {
          setLoading(true);
          try {
            const response = await useGetPenghuniById(id);
            if (response) {
              toggleModal(true, response);
            } else {
              Alert.alert("Error", "Tidak dapat menemukan data penghuni");
            }
          } catch (error) {
            Alert.alert("Error", "Gagal mengambil data penghuni");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const [filteredData, setFilteredData] = useState<{
    [key: string]: PenghuniData[];
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const filtered = penghuni.filter((item) =>
          item.Nama.toLowerCase().includes(search.toLowerCase())
        );

        const sections = filtered.reduce(
          (acc: { [key: string]: PenghuniData[] }, item) => {
            const firstLetter = item.Nama[0].toUpperCase();
            if (!acc[firstLetter]) {
              acc[firstLetter] = [];
            }
            acc[firstLetter].push(item);
            return acc;
          },
          {}
        );

        const sortedSections = Object.keys(sections)
          .sort()
          .reduce((acc: { [key: string]: PenghuniData[] }, key) => {
            acc[key] = sections[key].sort((a, b) =>
              a.Nama.localeCompare(b.Nama)
            );
            return acc;
          }, {});

        setFilteredData(sortedSections);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, penghuni]);

  const toggleModal = (setEdit: boolean, data?: Partial<PenghuniData>) => {
    setIsEditing(setEdit);
    setEditData(data || null);
    setModalVisible((prev) => !prev);
  };

  const handleSubmit = async (penghuniData: PenghuniData) => {
    setLoading(true);
    try {
      if (isEditing) {
        await useUpdatePenghuni(penghuniData);
        Alert.alert("Sukses", "Sukses Mengubah data Penghuni");
      } else {
        await useCreatePenghuni(penghuniData);
        Alert.alert("Sukses", "Sukses Menambah data Penghuni");
      }
      onRefresh(); // Refresh data after submission
    } catch (error) {
      Alert.alert("Error", "Error saat submit: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleFoto = (imageUri: string) => {
    setFoto({ uri: imageUri }); // Set the image object with a uri property
    setIsFotoVisible(true); // Set the modal visible
  };

  const action = (
    <Pressable onPress={() => toggleModal(false)}>
      <AntDesign name="plus" size={24} color="white" />
    </Pressable>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Implement your refresh logic here
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <BackHeaders aksi={action} judul={"Penghuni"} />
        <View className="flex-1 justify-center items-center bg-gray-200">
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <BackHeaders aksi={action} judul={"Penghuni"} />
      <View className="bg-emerald-500">
        <SearchBar value={search} onChangeText={setSearch} />
      </View>
      <ScrollView
        className="flex-1 bg-gray-200 w-screen h-screen"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {Object.entries(filteredData).map(([key, items]) => (
          <View key={key}>
            {!search && (
              <Text className="px-4 py-2 bg-emerald-500 text-lg text-white font-bold">
                {key}
              </Text>
            )}
            {items.map((item) => (
              <PenghuniListItem
                key={item.Id}
                item={item}
                onMorePress={(id) => handleMoreButton(id)}
                onRoomPress={() => setModalOn(!isModalOn)}
                onImagePress={handleFoto}
              />
            ))}
          </View>
        ))}
      </ScrollView>
      <AddPenghuniModal
        isVisible={isModalVisible}
        toggleModal={() => toggleModal(false)}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        dataEdit={editData}
      />
      <ImageView
        images={foto?.uri ? [{ uri: foto.uri }] : []}
        imageIndex={0}
        visible={isFotoVisible}
        onRequestClose={() => setIsFotoVisible(false)}
      />
    </SafeAreaProvider>
  );
};

export default Penghuni;
