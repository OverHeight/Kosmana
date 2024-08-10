import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import BackHeaders from "@/components/layouts/BackHeaders";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  KosanData,
  useDeleteKosan,
  useGetAllKosan,
  useGetKosanById,
} from "@/api/kosanAPI";
import Modal from "react-native-modal";
import { Image } from "@rneui/base";
import { deleteKamarByKosanId, useDeleteKamar } from "@/api/kamarAPI";

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
    <Link href={"/kost/tambahkost"}>
      {" "}
      <AntDesign name="plus" size={24} color="white" />{" "}
    </Link>
  );

  useEffect(() => {
    useGetAllKosan()
      .then((data) => setListKosan(data))
      .catch((e) => console.error(e.message));

    console.log(listKosan);
  }, []);

  const handleAlert = (id: number) => {
    Alert.alert("Reminder!", "Anda yakin ingin menghapus Kosan ini?", [
      {
        text: "Batal",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => handleDelete(id) },
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
      setDataKosan(response);
      console.log(response);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Sistem Error!");
    }
  };

  return (
    <SafeAreaProvider>
      <BackHeaders aksi={action} judul={"Kost"} />
      <Modal
        onBackButtonPress={() => setTriggerModal(!triggerModal)}
        isVisible={triggerModal}
      >
        <View className="flex justify-center items-center rounded-2xl bg-white">
          <View className="w-full py-2 flex-row justify-center items-center">
            <Text className="font-bold text-2xl">Detail Kosan</Text>
            <Pressable
              onPress={() => setTriggerModal(false)}
              className="absolute top-4 right-4"
            >
              <AntDesign name="closecircle" size={16} color="black" />
            </Pressable>
          </View>
          <Image
            source={
              dataKosan.ImageUri ? { uri: dataKosan.ImageUri } : undefined
            }
            style={{
              width: 320,
              height: 200,
              borderRadius: 10,
              marginVertical: 4,
            }}
          />
          <View className="my-4">
            <Text className="text-xl font-bold">{dataKosan.NamaKosan}</Text>
            <Text className="text-base">
              Kota: {dataKosan.Kota && dataKosan.Kota}
            </Text>
            <Text className="text-base">
              Alamat: {dataKosan.Alamat && dataKosan.Alamat}
            </Text>
            <Text className="text-base">
              Harga: Rp{" "}
              {new Intl.NumberFormat("id-ID").format(Number(dataKosan.Harga))}
            </Text>
            <Text className="text-base">
              Jumlah Kamar: {dataKosan.JumlahKamar && dataKosan.JumlahKamar}
            </Text>
            <Text className="text-base">
              Tipe Kosan: {dataKosan.TipeKosan && dataKosan.TipeKosan}
            </Text>
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
                  opacity: 0.4,
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
                    <FontAwesome name="trash" size={28} color="white" />
                  </Pressable>
                </View>
                <View className="flex-1 flex-row">
                  <View className="flex-1 justify-end items-start">
                    <View className="flex-row justify-center items-center gap-x-2 bg-amber-400/50 rounded-full py-1 px-3 mb-5 ml-4">
                      <FontAwesome5 name="bed" size={12} color="white" />
                      <Text className="text-md text-white font-bold text-center">
                        {e.JumlahKamar} kamar
                      </Text>
                    </View>
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
