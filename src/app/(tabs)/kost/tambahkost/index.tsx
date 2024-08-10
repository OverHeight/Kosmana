import React, { useMemo, useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  Text,
  Pressable,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BackHeaders from "@/components/layouts/BackHeaders";
import * as FileSystem from "expo-file-system";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group";
import { Picker } from "@react-native-picker/picker";
import Input from "@/components/inputs";
import { useCreateKosan, KosanData } from "@/api/kosanAPI";
import { useCreateKamar, KamarData } from "@/api/kamarAPI";

export default function tambahkost() {
  const [payload, setPayload] = useState<Partial<KosanData>>({
    NamaKosan: "",
    Harga: "",
    Kota: "",
    Alamat: "",
  });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tipeKosan, setTipeKosan] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [jumlahKamar, setJumlahKamar] = useState<number>(0);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleTipeKosanChange = (selectedId: string) => {
    const selectedButton = radioButtons.find(
      (button) => button.id === selectedId
    );
    setSelectedId(selectedButton?.id);
    setTipeKosan(selectedButton?.value);
  };

  const handleChange = (name: keyof KosanData, value: any) => {
    console.log(name, value);
    setPayload((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!imageUri) {
        Alert.alert("Error", "Tambahkan gambar Kosan!");
        return;
      }

      const kosanData: KosanData = {
        ...payload,
        ImageUri: imageUri,
        JumlahKamar: jumlahKamar,
        TipeKosan: tipeKosan || "",
        NamaKosan: payload.NamaKosan || "",
        Harga: payload.Harga || "",
        Kota: payload.Kota || "",
        Alamat: payload.Alamat || "",
      };
      const kosanId = await useCreateKosan(kosanData);

      const kamarData: KamarData = {
        KosanId: kosanId,
      };
      const createKamar = async () => {
        const kamarIds = [];
        for (let i = 0; i < jumlahKamar; i++) {
          const kamarList = await useCreateKamar(kamarData);
          console.log("added new kamar to kosan " + kosanId);
          kamarIds.push(kamarList);
        }
      };

      const kamarId = await createKamar();

      console.log("Sukses menambah kosan", kosanId);
      console.log("Sukses menambah kamar", kamarId);
      Alert.alert("Sukses", "Sukses Menambah data Kosan dan Kamar");
    } catch (error) {
      console.error("isi Payload: ", payload);
      console.error("Gagal menambahkan kosan atau kamar: ", error);
      Alert.alert("Gagal", "Gagal menambahkan kosan atau kamar");
    }
  };

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      { id: "1", label: "Laki-Laki", value: "Laki-Laki" },
      { id: "2", label: "Perempuan", value: "Perempuan" },
    ],
    []
  );

  const NoKam = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BackHeaders aksi={""} judul={"Tambah Kost"} />
        <View style={styles.container} className="bg-gray-200">
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          <View tw="my-2">
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.image} />
            )}
          </View>
          <View className="flex justify-center items-center">
            <View tw="w-screen px-4 gap-4">
              <Input
                type="text"
                title="Nama Kosan"
                placeholder="Input Nama Kosan disini"
                className="mb-4"
                onChange={(value: any) => handleChange("NamaKosan", value)}
              />
              <Input
                type="text"
                title="Kota"
                placeholder="Input Kota disini"
                className="mb-4 bg-neutral-300"
                onChange={(value: any) => handleChange("Kota", value)}
              />
              <Input
                type="text"
                title="Alamat"
                placeholder="Input Alamat disini"
                className="mb-4"
                onChange={(value: any) => handleChange("Alamat", value)}
              />
              <Input
                type="text"
                title="Harga"
                placeholder="Input Harga disini"
                className="mb-4"
                onChange={(value: any) => handleChange("Harga", value)}
              />
              <View tw="px-6">
                <Text tw="text-md font-bold">Jumlah Kamar</Text>
                <View className="bg-neutral-300">
                  <Picker
                    selectedValue={jumlahKamar}
                    onValueChange={(value) => setJumlahKamar(value)}
                  >
                    {NoKam.map((e) => (
                      <Picker.Item key={e} label={e.toString()} value={e} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View tw="px-6">
                <Text tw="text-md font-bold">Tipe Kosan</Text>
                <RadioGroup
                  layout="row"
                  radioButtons={radioButtons}
                  onPress={handleTipeKosanChange}
                  selectedId={selectedId}
                />
              </View>
              <View tw="px-6 items-center justify-center">
                <Pressable
                  onPress={handleSubmit}
                  className="bg-green-600 p-4 rounded-xl"
                >
                  <Text className="text-white font-bold text-lg">
                    Tambah Kosan
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  image: {
    width: 200,
    height: 200,
  },
});
