import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import BackHeaders from "@/components/layouts/BackHeaders";
import { useNavigation } from "@react-navigation/native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import CustomModal from "@/components/Modal/CustomModal";
import moment from "moment";
import { usePenghuniData } from "@/hooks/usePenghuniData";
import SearchBar from "@/components/SearchBar";
import { PenghuniData, PenghuniKamarData } from "@/types/DBtypes";
import {
  useCreatePenghuniKamar,
  useUpdatePenghuniKamar,
  useGetPenghuniKamarById,
} from "@/api/Penghuni_KamarAPI";
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group";
import { useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const TambahPenghuni = () => {
  const { id, TransId } = useLocalSearchParams(); // TransId to identify if editing
  const [penghuniKamarData, setPenghuniKamarData] = useState<
    Partial<PenghuniKamarData>
  >({
    KamarId: Number(id),
    PenghuniId: undefined,
    StatusKamar: 1,
    TanggalMasuk: moment().format("YYYY-MM-DD"),
    TanggalKeluar: undefined,
    StatusPembayaran: 0,
  });
  const [selectedPenghuni, setSelectedPenghuni] = useState<PenghuniData | null>(
    null
  );
  const [search, setSearch] = useState<string>("");
  const [tanggalMasuk, setTanggalMasuk] = useState<Date | null>(null);
  const [tanggalKeluar, setTanggalKeluar] = useState<Date | null>(null);
  const [filteredPenghuni, setFilteredPenghuni] = useState<PenghuniData[]>([]);
  const [statusPemabayaran, setStatusPembayaran] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const penghuni = usePenghuniData();

  const navigation = useNavigation();

  useEffect(() => {
    const filtered = penghuni.filter((item) =>
      item.Nama.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPenghuni(filtered);
  }, [search, penghuni]);

  useEffect(() => {
    if (TransId !== null) {
      // Fetch the existing data if TransId is provided and not null
      const fetchPenghuniKamarData = async () => {
        try {
          const data: PenghuniKamarData | null = await useGetPenghuniKamarById(
            Number(TransId)
          );
          if (data !== null) {
            setPenghuniKamarData(data);
            setSelectedPenghuni(
              penghuni.find((p) => p.Id === data.PenghuniId) || null
            );
            setTanggalMasuk(
              data.TanggalMasuk ? new Date(data.TanggalMasuk) : null
            );
            setTanggalKeluar(
              data.TanggalKeluar ? new Date(data.TanggalKeluar) : null
            );
            setStatusPembayaran(data.StatusPembayaran || 0);
            setSelectedId(data.StatusPembayaran?.toString());
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          Alert.alert("Error", "Gagal mengambil data");
        }
      };
      fetchPenghuniKamarData();
    }
  }, [TransId, penghuni]);

  const handleRadioChange = (selectedId: string) => {
    const selectedButton = radioButtons.find(
      (button) => button.id === selectedId
    );
    setSelectedId(selectedButton?.id);
    setStatusPembayaran(Number(selectedButton?.value));
  };
  const handleSave = async () => {
    if (!selectedPenghuni) {
      Alert.alert("Error", "Silakan pilih penghuni terlebih dahulu");
      return;
    }

    const dataToSave: PenghuniKamarData = {
      ...penghuniKamarData,
      PenghuniId: Number(selectedPenghuni.Id),
      KamarId: Number(id),
      StatusPembayaran: statusPemabayaran,
      TanggalMasuk: tanggalMasuk
        ? moment(tanggalMasuk).format("YYYY-MM-DD")
        : moment(new Date()).format("YYYY-MM-DD"),
      TanggalKeluar: moment(tanggalKeluar).format("YYYY-MM-DD"),
      StatusKamar: penghuniKamarData.StatusKamar ?? null,
    };

    try {
      if (TransId) {
        // Update existing data
        await useUpdatePenghuniKamar(dataToSave); // Pass only the dataToSave object
        Alert.alert("Sukses", "Data berhasil diperbarui");
      } else {
        // Create new data
        const savedId = await useCreatePenghuniKamar(dataToSave, Number(id));
        console.log("Data saved with ID:", savedId);
        Alert.alert("Sukses", "Data berhasil disimpan");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Gagal menyimpan data");
    }
  };

  const onChangeDate = (
    type: "TanggalMasuk" | "TanggalKeluar",
    selectedDate: Date
  ) => {
    if (type === "TanggalMasuk") {
      setTanggalMasuk(selectedDate);
    } else {
      setTanggalKeluar(selectedDate);
    }
  };

  const showDatePicker = (type: "TanggalMasuk" | "TanggalKeluar") => {
    DateTimePickerAndroid.open({
      value: penghuniKamarData[type]
        ? new Date(penghuniKamarData[type] as string)
        : new Date(),
      onChange: (event, selectedDate) =>
        onChangeDate(type, selectedDate || new Date()),
      mode: "date",
      is24Hour: true,
    });
  };

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      { id: "1", label: "Sudah", value: "1" },
      { id: "2", label: "Belum", value: "0" },
    ],
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeaders judul={TransId ? "Edit Kamar" : "Isi Kamar"} />
      <View className="flex-1 justify-center p-8">
        <View className="my-4 gap-y-2">
          <Pressable
            onPress={() => setIsModalVisible(true)}
            className="flex justify-center items-center bg-emerald-500 rounded-xl p-3"
          >
            <Text className="text-base font-bold text-white">
              Pilih Penghuni
            </Text>
          </Pressable>
          <View className="flex w-full justify-center items-center border bg-white rounded-xl p-4">
            <Text className="text-lg font-bold text-gray-700">
              {selectedPenghuni ? selectedPenghuni.Nama : "Belum dipilih"}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-x-2 w-full">
          <Pressable
            onPress={() => showDatePicker("TanggalMasuk")}
            className="flex-1 w-1/2"
          >
            <Text className="my-1 text-base font-medium">Tanggal Masuk</Text>
            <View className="flex bg-gray-200 p-4 justify-center items-center rounded-lg border border-gray-300">
              <Text className="text-gray-800 text-Base font-bold">
                {tanggalMasuk
                  ? moment(tanggalMasuk).format("YYYY-MM-DD")
                  : "Hari ini"}
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => showDatePicker("TanggalKeluar")}
            className="flex-1 w-1/2"
          >
            <Text className="my-1 text-base font-medium">Tanggal Keluar</Text>
            <View className="flex bg-gray-200 p-4 justify-center items-center rounded-lg border border-gray-300">
              <Text className="text-gray-800 text-Base font-bold">
                {tanggalKeluar
                  ? moment(tanggalKeluar).format("YYYY-MM-DD")
                  : "?"}
              </Text>
            </View>
          </Pressable>
        </View>
        <View className="my-4">
          <Text className="text-base font-medium">Status Pembayaran</Text>
          <RadioGroup
            layout="row"
            radioButtons={radioButtons}
            selectedId={selectedId}
            onPress={handleRadioChange}
          />
        </View>
        <TouchableOpacity
          className="flex p-2 bg-green-500 rounded-lg justify-center items-center"
          onPress={handleSave}
        >
          <Text className="text-lg font-semibold text-white">Simpan</Text>
        </TouchableOpacity>
      </View>
      <CustomModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <View style={{ height: "80%" }}>
          <View className="bg-emerald-500 rounded-t-2xl">
            <View className="flex-row p-2 justify-between items-center">
              <View></View>
              <Text className="text-base font-bold text-white">
                Cari Penghuni
              </Text>
              <MaterialIcons
                onPress={() => setIsModalVisible(false)}
                name="cancel"
                size={24}
                color="white"
              />
            </View>
            <SearchBar value={search} onChangeText={setSearch} />
          </View>
          <ScrollView className="flex-col">
            {filteredPenghuni.map((item) => (
              <TouchableOpacity
                className="flex-row gap-x-2 justify-start items-center border-b border-gray-500 p-4 shadow-md rounded-lg"
                key={item.Id}
                onPress={() => {
                  setSelectedPenghuni(item);
                  setIsModalVisible(false);
                }}
              >
                {item.JenisKelamin === "Laki-Laki" ? (
                  <Ionicons name="man" size={24} color="black" />
                ) : (
                  <Ionicons name="woman" size={24} color="black" />
                )}
                <Text className="text-base font-semibold">{item.Nama}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </CustomModal>
    </SafeAreaView>
  );
};

export default TambahPenghuni;
