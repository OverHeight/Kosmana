import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import BackHeaders from "@/components/layouts/BackHeaders";
import { Entypo, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import { KosanData, useGetAllKosan } from "@/api/kosanAPI";
import {
  KamarData,
  updatePaymentStatus,
  useCreateKamar,
  useDeleteKamar,
  useGetAllKamar,
} from "@/api/kamarAPI";
import {
  PenghuniData,
  useAddKamar,
  useDeletePenghuni,
  useGetAllPenghuni,
  useGetPenghuniByKamarId,
  useRemoveKamar,
  useUpdatePenghuni,
} from "@/api/PenghuniAPI";

const kamar = () => {
  const [sudahBayar, setSudahBayar] = useState<Boolean>(false);
  const [listKamar, setListKamar] = useState<KamarData[]>([]);
  const [listKosan, setListKosan] = useState<KosanData[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [listPenghuni, setListPenghuni] = useState<PenghuniData[]>([]);
  const [selectedKamar, setSelectedKamar] = useState<number | undefined>(
    undefined
  );
  const [selectedPenghuni, setSelectedPenghuni] = useState<number | undefined>(
    undefined
  );
  const [kosan, setKosan] = useState<number>(1);
  const [editPenghuni, setEditPenghuni] = useState<number | undefined>(
    undefined
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModal2Visible, setIsModal2Visible] = useState<boolean>(false);
  const [penghuniByKamarId, setPenghuniByKamarId] = useState<
    Record<number, PenghuniData | null>
  >({});

  useEffect(() => {
    const fetchPenghuniData = async () => {
      try {
        const penghuniData: Record<number, PenghuniData | null> = {};
        for (const kamar of listKamar) {
          if (kamar.Id !== undefined) {
            const penghuni = await useGetPenghuniByKamarId(kamar.Id);
            penghuniData[kamar.Id] = penghuni;
          }
        }
        setPenghuniByKamarId(penghuniData);
      } catch (err) {
        console.error(err);
      }
    };

    if (listKamar.length > 0) {
      fetchPenghuniData();
    }
  }, [listKamar, isModal2Visible, isModalVisible]);

  useEffect(() => {
    useGetAllKosan()
      .then((data) => setListKosan(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allKamar = await useGetAllKamar();
        setListKamar(
          allKamar.filter((kamar) => kamar.KosanId === Number(kosan))
        );
      } catch (err) {
        console.error(err);
      }
    };

    if (kosan) {
      fetchData();
    } else {
      useGetAllKamar()
        .then((data: KamarData[]) => setListKamar(data))
        .catch((err) => console.error(err));
    }
  }, [kosan]);

  useEffect(() => {
    useGetAllPenghuni()
      .then((data) => setListPenghuni(data))
      .catch((err) => console.error(err));
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleHold = (id: number, PenghuniId: number) => {
    setIsModalVisible(!isModalVisible);
    setIsModal2Visible(!isModal2Visible);
    setSelectedKamar(id);
    setSelectedPenghuni(PenghuniId);
  };

  const handlePembayaran = async (kamarId: number, status: number) => {
    try {
      var newStatus = null;
      if (status == 0) newStatus = 1;
      if (status == 1) newStatus = 0;
      setSudahBayar(!sudahBayar);

      const response = await updatePaymentStatus(kamarId, Number(newStatus));

      Alert.alert("Sukses", "Sukses Mengubah status pembayaran");
      console.log(response);
    } catch (error) {
      console.error("Error updating payment status:", error);
      Alert.alert("Error", "Error Sistem!");
    }
  };

  const handleAddKamar = () => {
    try {
      const newKamar: KamarData = {
        KosanId: kosan,
      };
      useCreateKamar(newKamar);
      Alert.alert("Sukses", "sukes menambahkan kamar di kosan");
    } catch (error) {
      Alert.alert("Error", "gagal menambahkan Kamar");
    }
  };

  const hapusKamar = async (id: number) => {
    try {
      if (!id) return Alert.alert("Error", "Kamar tidak ditemukan!");

      const response = await useDeleteKamar(id);
      setIsModalVisible(!isModalVisible);
      setIsModal2Visible(false);
      setSelectedKamar(undefined);
      setSelectedPenghuni(undefined);
      Alert.alert("Sukses", "Kamar telah dihapus");
      console.log(response);
    } catch (error) {
      Alert.alert("Error", "Error Sistem!");
    }
  };

  const hapusPenghuni = async (id: number) => {
    try {
      if (!id) return Alert.alert("Error", "Penghuni tidak ditemukan!");

      const response = await useRemoveKamar(id);
      setIsModalVisible(!isModalVisible);
      setIsModal2Visible(false);
      setSelectedKamar(undefined);
      setSelectedPenghuni(undefined);
      Alert.alert("Sukses", "Penghuni telah dihapus");
      console.log(response);
    } catch (error) {
      Alert.alert("Error", "Error Sistem!");
    }
  };

  const handleAdd = async (id: number) => {
    try {
      const response = await useAddKamar(id, Number(editPenghuni));
      setIsModalVisible(!isModalVisible);
      setIsModal2Visible(false);
      setSelectedKamar(undefined);
      setSelectedPenghuni(undefined);
      Alert.alert("Sukses", "sukses menambahkan penghuni kedalam kamar");
      console.log(response);
    } catch (error) {
      Alert.alert("Error", "Gagal menambahkan penghuni");
    }
  };

  return (
    <SafeAreaProvider>
      <BackHeaders judul={"Kamar"} />
      <ScrollView
        refreshControl={
          <RefreshControl
            className="bg-emerald-500"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        className="flex-1 bg-gray-200"
      >
        <Modal
          onBackButtonPress={() => setIsModalVisible(!isModalVisible)}
          isVisible={isModalVisible}
        >
          <View className="flex justify-center items-center rounded-2xl p-4 bg-white">
            {isModal2Visible ? (
              <View className="flex justify-center items-center divide-y-2 divide-gray-600">
                <Pressable
                  onPress={() => hapusKamar(Number(selectedKamar))}
                  className="p-4 w-full"
                >
                  <Text className="text-lg font-bold">Hapus Kamar</Text>
                </Pressable>
                <Pressable
                  onPress={() => hapusPenghuni(Number(selectedPenghuni))}
                  className="p-4 w-full"
                >
                  <Text className="text-lg font-bold">Hapus Penghuni</Text>
                </Pressable>
              </View>
            ) : (
              listPenghuni.map((e) => (
                <Pressable
                  className="w-full text-white px-4 py-2 rounded-md border-b-2 border-gray-700"
                  key={e.Id}
                  onPress={() => handleAdd(Number(e.Id))}
                >
                  <Text className="font-bold text-base text-black text-center">
                    {e.Nama}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        </Modal>
        <View>
          <View className="flex-row justify-between w-screen h-max px-2 bg-emerald-600">
            <View className="flex-1 flex-row items-center">
              <View className="flex-1">
                <Picker
                  selectedValue={kosan}
                  onValueChange={(value) => setKosan(value as number)}
                  style={{ color: "white", maxWidth: 200 }}
                >
                  {listKosan.map((e) => (
                    <Picker.Item key={e.Id} label={e.NamaKosan} value={e.Id} />
                  ))}
                </Picker>
              </View>
            </View>
            <Pressable
              onPress={handleAddKamar}
              className="h-8 w-10 my-2 mr-2 justify-center items-center bg-emerald-500 rounded-full"
            >
              <Entypo name="plus" size={16} color="white" />
            </Pressable>
          </View>
          <View className="flex flex-col px-2 pb-1 pt-3 gap-y-4">
            {listKamar.map((kamar, index) => {
              const IntToBool = (int: number) => {
                var newBool = null;
                if ((int = 0)) newBool = false;
                if (int > 0) newBool = true;
                return newBool;
              };
              console.log(sudahBayar);
              const penghuni =
                kamar.Id !== undefined ? penghuniByKamarId[kamar.Id] : null;
              const handleModal = () => {
                if (penghuni) {
                  null;
                } else {
                  setIsModalVisible(!isModalVisible);
                  setIsModal2Visible(false);
                  setEditPenghuni(kamar.Id);
                }
              };
              return (
                <Pressable
                  key={kamar.Id}
                  onLongPress={() =>
                    handleHold(Number(kamar.Id), Number(penghuni?.Id))
                  }
                >
                  <View className="bg-neutral-50 p-4 flex-col rounded-lg border border-gray-200 shadow-sm">
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-xl font-semibold text-gray-700">
                        Kamar No.{index + 1}
                      </Text>
                      {penghuni ? (
                        <Pressable
                          onPress={() =>
                            handlePembayaran(
                              Number(kamar.Id),
                              Number(kamar.StatusPembayaran)
                            )
                          }
                        >
                          <View
                            className={`flex-row items-center px-3 py-1 rounded-full ${
                              kamar.StatusPembayaran
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            <FontAwesome5
                              name="money-bill-wave"
                              size={16}
                              color="white"
                            />
                            <Text className="text-sm text-white font-semibold ml-2">
                              {kamar.StatusPembayaran
                                ? "Sudah Bayar"
                                : "Belum Bayar"}
                            </Text>
                          </View>
                        </Pressable>
                      ) : null}
                    </View>
                    <Pressable
                      onPress={handleModal}
                      className="flex-row justify-center items-center bg-teal-500 rounded-lg p-2"
                    >
                      <FontAwesome name="user" size={14} color="white" />
                      <Text className="text-sm text-white font-semibold ml-3">
                        {penghuni ? penghuni.Nama : "Kosong"}
                      </Text>
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default kamar;
