import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BackHeaders from "@/components/layouts/BackHeaders";
import { Link } from "expo-router";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SearchBar, Button } from "@rneui/themed";
import Accordion from "@/components/Accordion";
import {
  PenghuniData,
  useCreatePenghuni,
  useGetAllPenghuni,
} from "@/api/PenghuniAPI";
import Modal from "react-native-modal";
import { Input } from "@rneui/base";
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group";

const penghuni = () => {
  const [search, setSearch] = useState<string>("");
  const [penghuni, setPenghuni] = useState<PenghuniData[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalOn, setModalOn] = useState<boolean>(false);
  const [jenisKelamin, setJenisKelamin] = useState<string | undefined>(
    undefined
  );
  const [payload, setPayload] = useState<Partial<PenghuniData>>({
    Nama: "",
    Umur: undefined,
    JenisKelamin: "",
    NoTelp: "",
  });

  const handleSubmit = async () => {
    try {
      if (!payload.Nama || !payload.NoTelp || !jenisKelamin || !payload.Umur) {
        Alert.alert("Error", "isi semua Form!");
        console.log(payload);
        return;
      }

      const penghuniData = {
        Nama: payload.Nama || "",
        Umur: Number(payload.Umur) || 0,
        JenisKelamin: jenisKelamin || "",
        NoTelp: payload.NoTelp || "",
      };

      const penghuniId = await useCreatePenghuni(penghuniData);

      console.log("Sukses menambah penghuni", penghuniId);
      Alert.alert("Sukses", "Sukses Menambah data Penghuni");
      return toggleModal();
    } catch (error) {
      console.error("Payload: ", payload);
      console.error("Gagal menambahkan penghuni: ", error);
      Alert.alert("Gagal", "Gagal menambahkan penghuni");
    }
  };

  const handleChange = (name: keyof Partial<PenghuniData>, value: string) => {
    setPayload((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const fetchPenghuni = async () => {
      try {
        const data = await useGetAllPenghuni();
        setPenghuni(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPenghuni();
  }, [penghuni]);

  const [filteredData, setFilteredData] = useState<{
    [key: string]: PenghuniData[];
  }>({});

  useEffect(() => {
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

    // Sort items within each section alphabetically
    Object.keys(sections).forEach((key) => {
      sections[key].sort((a, b) => a.Nama.localeCompare(b.Nama));
    });

    setFilteredData(sections);
  }, [search, penghuni]);

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      { id: "1", label: "Laki-Laki", value: "Laki-Laki" },
      { id: "2", label: "Perempuan", value: "Perempuan" },
    ],
    []
  );

  const handleJenisKelaminChange = (selectedId: string) => {
    const selectedButton = radioButtons.find(
      (button) => button.id === selectedId
    );
    setSelectedId(selectedButton?.id);
    setJenisKelamin(selectedButton?.value);
  };

  const action = (
    <Pressable onPress={toggleModal}>
      <AntDesign name="plus" size={24} color="white" />
    </Pressable>
  );

  return (
    <SafeAreaProvider>
      <BackHeaders aksi={action} judul={"Penghuni"} />
      <Modal isVisible={isModalVisible} onBackButtonPress={toggleModal}>
        <View className="flex justify-center items-center rounded-2xl p-4 bg-white">
          <View className="pt-2 pb-4">
            <Text className="text-lg font-bold">Tambah Penghuni</Text>
          </View>
          <View className="flex-row w-full">
            <Input
              onChangeText={(value: any) => handleChange("Nama", value)}
              placeholder="Masukan Nama"
              label="Nama"
            />
          </View>
          <View className="flex-row w-full">
            <Input
              onChangeText={(value: any) => handleChange("Umur", value)}
              placeholder="Masukan Umur"
              label="Umur"
              keyboardType="numeric"
            />
          </View>
          <View className="mx-2 flex w-full mb-4">
            <Text className="ml-2 text-base font-bold text-gray-400">
              Jenis Kelamin
            </Text>
            <RadioGroup
              layout="row"
              radioButtons={radioButtons}
              onPress={handleJenisKelaminChange}
              selectedId={selectedId}
            />
          </View>
          <View className="flex-row w-full">
            <Input
              onChangeText={(value: any) => handleChange("NoTelp", value)}
              placeholder="Masukan Nomor Telepon"
              label="Nomor Telepon"
            />
          </View>
          <View className="flex-row w-full gap-x-2 justify-end">
            <Pressable
              onPress={toggleModal}
              className="border border-neutral-700 py-3 justify-center items-center px-4 w-[30%] rounded-xl"
            >
              <Text className="text-base font-medium text-black">Batal</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              className="bg-green-500 py-3 justify-center items-center px-4 w-[30%] rounded-xl"
            >
              <Text className="text-base font-medium text-white">Tambah</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View className="flex-row bg-emerald-500 p-2">
        <View className="w-full ">
          <SearchBar
            platform="android"
            containerStyle={{
              height: 30,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            inputStyle={{ fontSize: 16 }}
            inputContainerStyle={{ height: 5 }}
            onChangeText={(text) => setSearch(text)}
            value={search}
            placeholder="Cari Nama disini..."
          />
        </View>
      </View>
      <ScrollView className="flex-1 bg-gray-200 w-screen h-screen">
        {Object.keys(filteredData).map((key) => (
          <View key={key} className="">
            {search ? null : (
              <Text className="px-4 py-2 bg-emerald-500 text-lg text-white font-bold">
                {key}
              </Text>
            )}
            {filteredData[key].map((item) => (
              <Accordion key={item.Id} title={item.Nama} penggunaId={item.Id}>
                <Pressable
                  onPress={item.IdKamar ? null : () => setModalOn(!isModalOn)}
                  className="flex-row justify-center items-center bg-teal-500 rounded-lg mb-2 p-2"
                >
                  <Ionicons name="bed" size={14} color="white" />
                  {item.IdKamar ? (
                    <Text className="text-sm text-white font-semibold ml-3">
                      Kamar No.{item.IdKamar}
                    </Text>
                  ) : (
                    <Text className="text-sm text-white font-semibold ml-3">
                      Tidak Terdaftar
                    </Text>
                  )}
                </Pressable>
                <View className="flex-row items-center">
                  <Text className="text-base font-semibold">Nama: </Text>
                  <Text className="text-base text-gray-700 font-medium">
                    {item.Nama}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base font-semibold">Umur: </Text>
                  <Text className="text-base text-gray-700 font-medium">
                    {item.Umur}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base font-semibold">
                    Jenis Kelamin:{" "}
                  </Text>
                  <Text className="text-base text-gray-700 font-medium">
                    {item.JenisKelamin}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base font-semibold">
                    Nomor Telepon:{" "}
                  </Text>
                  <Text className="text-base text-gray-700 font-medium">
                    {item.NoTelp}
                  </Text>
                </View>
              </Accordion>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default penghuni;
