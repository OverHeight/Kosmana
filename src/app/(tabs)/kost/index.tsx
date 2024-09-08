import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import BackHeaders from "@/components/layouts/BackHeaders";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useDeleteKosan,
  useGetAllKosan,
  useGetKosanById,
} from "@/api/kosanAPI";
import { Image } from "@rneui/base";
import {
  countKamarByKosan,
  deleteKamarByKosanId,
  useDeleteKamar,
} from "@/api/kamarAPI";
import { navFromKosan } from "@/hooks/kosanHook";
import { KosanData } from "@/types/DBtypes";

const kost = () => {
  const [listKosan, setListKosan] = useState<KosanData[]>([]);
  const [triggerModal, setTriggerModal] = useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [dataKosan, setDataKosan] = useState({
    NamaKosan: "",
    Alamat: "",
    Kota: "",
    ImageUri: "",
    Harga: "",
    JumlahKamar: null,
    TipeKosan: "",
  });
  const action = (
    <Link href={"/kost/TambahKost/0"}>
      {" "}
      <AntDesign name="plus" size={24} color="white" />{" "}
    </Link>
  );

  useEffect(() => {
    useGetAllKosan()
      .then((data) => setListKosan(data))
      .catch((e) => console.error(e.message));
  }, [listKosan]);

  const handleAlert = (id: number) => {
    Alert.alert("Reminder!", "Apa yang ingin anda lakukan dengan kosan ini?", [
      {
        text: "Batal",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "Edit Kosan",
        onPress: () => router.navigate(`/kost/TambahKost/${id}`),
      },
      { text: "Hapus Kosan", onPress: () => handleDelete(id) },
    ]);
  };

  const handleDelete = async (id: number) => {
    try {
      await useDeleteKosan(id);
      await deleteKamarByKosanId(id);
      Alert.alert("Sukses", "Sukses menghapus Kosan!");
    } catch (error) {
      Alert.alert("Error", "Error Sistem!");
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handlePress = async (id: number) => {
    setTriggerModal(!triggerModal);
    try {
      const response = await useGetKosanById(id);
      const kamarCount = await countKamarByKosan(id);
      setDataKosan({ ...response, JumlahKamar: kamarCount });
      // setDataKosan(response);
      console.log(response);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Sistem Error!");
    }
  };

  if (listKosan.length <= 0)
    return (
      <SafeAreaProvider>
        <BackHeaders aksi={action} judul={"kost"} />
        <View className="flex-1 justify-center items-center bg-white">
          <Text className="text-gray-700 font-bold text-lg text-center">
            Belum ada kosan
          </Text>
        </View>
      </SafeAreaProvider>
    );

  return (
    <SafeAreaProvider>
      <BackHeaders aksi={action} judul={"Kost"} />
      <Modal
        visible={triggerModal}
        onRequestClose={() => setTriggerModal(!triggerModal)}
        animationType="fade"
        transparent
        style={{ margin: 0 }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-11/12 rounded-2xl bg-white p-6 shadow-lg max-h-[90%]">
            <View className="w-full flex-row justify-between items-center mb-4">
              <Text className="font-bold text-2xl text-emerald-500">
                Detail Kosan
              </Text>
              <Pressable onPress={() => setTriggerModal(false)} className="p-2">
                <AntDesign name="closecircle" size={20} color="#10b981" />
              </Pressable>
            </View>
            <ScrollView>
              <View className="w-full justify-center items-center mb-4">
                <Image
                  source={
                    dataKosan.ImageUri ? { uri: dataKosan.ImageUri } : undefined
                  }
                  style={{
                    width: 280,
                    height: 160,
                    borderRadius: 10,
                    marginVertical: 4,
                    resizeMode: "cover",
                  }}
                  className="w-full h-40 rounded-lg"
                />
              </View>
              <View className="space-y-2">
                <Text className="text-xl font-bold text-gray-900">
                  {dataKosan.NamaKosan}
                </Text>
                <View className="flex-row justify-between">
                  <Text className="text-base text-gray-700">Kota:</Text>
                  <Text className="text-base text-gray-700">
                    {dataKosan.Kota}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-base text-gray-700">Alamat:</Text>
                  <TouchableOpacity
                    onPress={() => Alert.alert("Alamat", dataKosan.Alamat)}
                  >
                    <Text
                      className="text-base text-gray-700"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {dataKosan.Alamat}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-base text-gray-700">Harga:</Text>
                  <Text className="text-base text-gray-700">
                    Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(
                      Number(dataKosan.Harga)
                    )}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-base text-gray-700">Jumlah Kamar:</Text>
                  <Text className="text-base text-gray-700">
                    {dataKosan.JumlahKamar}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-base text-gray-700">Tipe Kosan:</Text>
                  <Text className="text-base text-gray-700">
                    {dataKosan.TipeKosan}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView
        refreshControl={
          <RefreshControl
            className="bg-emerald-500"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        className="container flex-1 bg-gray-200 w-screen h-screen"
      >
        <View className="my-2 items-center">
          {/* test */}
          {listKosan.map((e, index) => (
            <View key={index} className="m-4">
              <ImageBackground
                source={e.ImageUri ? { uri: e.ImageUri } : undefined}
                style={{
                  width: 320,
                  height: 185,
                }}
                imageStyle={{
                  borderRadius: 20,
                  opacity: 0.6,
                  backgroundColor: "black",
                }}
              >
                <View className="flex-1 flex-row w-full">
                  <View className="flex-1 p-3">
                    <Text className="text-3xl text-white font-bold">
                      {e.NamaKosan}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => handleAlert(Number(e.Id))}
                    className="flex-1 justify-start items-end p-4"
                  >
                    <Entypo
                      name="dots-three-vertical"
                      size={24}
                      color="white"
                    />
                  </Pressable>
                </View>
                <View className="flex-1 flex-row">
                  <View className="flex-1 justify-end items-start">
                    <Pressable
                      onPress={() => navFromKosan(Number(e.Id))}
                      className="flex-row justify-center items-center gap-x-2 bg-amber-400/50 rounded-full py-1 px-3 mb-5 ml-4"
                    >
                      <FontAwesome5 name="bed" size={12} color="white" />
                      <Text className="text-md text-white font-bold text-center">
                        {e.JumlahKamar} kamar
                      </Text>
                    </Pressable>
                  </View>
                  <View className="flex-1 justify-end items-end">
                    <View className="mb-4">
                      <Pressable
                        onPress={() => handlePress(Number(e.Id))}
                        className="bg-green-500 p-2 px-4 rounded-full mr-4"
                      >
                        <Text className="font-bold text-white text-md">
                          Lihat Detail
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default kost;
