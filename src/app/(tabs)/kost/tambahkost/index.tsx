import React, { useMemo, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Alert,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BackHeaders from "@/components/layouts/BackHeaders";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group";
import { Picker } from "@react-native-picker/picker";
import Input from "@/components/inputs";
import { useCreateKosan } from "@/api/kosanAPI";
import { useCreateKamar } from "@/api/kamarAPI";
import { KamarData, KosanData } from "@/types/DBtypes";

type JumlahKamarType = number | "custom";

export default function TambahKost() {
  const [payload, setPayload] = useState<Partial<KosanData>>({
    NamaKosan: "",
    Harga: 0,
    Kota: "",
    Alamat: "",
  });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tipeKosan, setTipeKosan] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [jumlahKamar, setJumlahKamar] = useState<JumlahKamarType>(0);
  const [customJumlahKamar, setCustomJumlahKamar] = useState<string>("");

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
    setPayload((prev) => ({
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

      const finalJumlahKamar =
        jumlahKamar === "custom"
          ? parseInt(customJumlahKamar, 10)
          : jumlahKamar;

      if (isNaN(finalJumlahKamar) || finalJumlahKamar <= 0) {
        Alert.alert("Error", "Masukkan jumlah kamar yang valid!");
        return;
      }

      const kosanData: KosanData = {
        ...payload,
        JumlahKamar: finalJumlahKamar,
        TipeKosan: tipeKosan || "",
        NamaKosan: payload.NamaKosan || "",
        Harga: payload.Harga || 0,
        Kota: payload.Kota || "",
        Alamat: payload.Alamat || "",
        ImageUri: imageUri,
      };
      const kosanId = await useCreateKosan(kosanData);

      const createKamar = async () => {
        let kamarIds = [];
        const finalJumlahKamar =
          jumlahKamar === "custom"
            ? parseInt(customJumlahKamar, 10)
            : jumlahKamar;

        if (isNaN(finalJumlahKamar) || finalJumlahKamar <= 0) {
          throw new Error("Invalid number of rooms");
        }

        for (let i = 1; i <= finalJumlahKamar; i++) {
          const kamarPayload: KamarData = {
            KosanId: kosanId,
            Harga: Number(payload.Harga),
            NoKam: i,
          };
          const kamarList = await useCreateKamar(kamarPayload);
          kamarIds.push(kamarList);
        }
        return kamarIds;
      };

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

  const NoKam: JumlahKamarType[] = [
    ...Array.from({ length: 8 }, (_, i) => i + 1),
    "custom",
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <BackHeaders aksi={""} judul={"Tambah Kost"} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.mainView}>
            <View style={styles.imageSection}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>No Image</Text>
                </View>
              )}
              <Pressable onPress={pickImage} style={styles.imageButton}>
                <Text style={styles.imageButtonText}>Choose Image</Text>
              </Pressable>
            </View>
            <View style={styles.formContainer}>
              <Input
                type="text"
                title="Nama Kosan"
                placeholder="Input Nama Kosan disini"
                style={styles.input}
                onChange={(value: any) => handleChange("NamaKosan", value)}
              />
              <Input
                type="text"
                title="Kota"
                placeholder="Input Kota disini"
                style={styles.input}
                onChange={(value: any) => handleChange("Kota", value)}
              />
              <Input
                type="text"
                title="Alamat"
                placeholder="Input Alamat disini"
                style={styles.input}
                onChange={(value: any) => handleChange("Alamat", value)}
              />
              <Input
                type="number"
                title="Harga"
                placeholder="Input Harga disini"
                style={styles.input}
                onChange={(value: any) => handleChange("Harga", value)}
              />
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Jumlah Kamar</Text>
                <Picker
                  selectedValue={jumlahKamar}
                  onValueChange={(value: JumlahKamarType) =>
                    setJumlahKamar(value)
                  }
                  style={styles.picker}
                >
                  {NoKam.map((e) => (
                    <Picker.Item
                      key={e.toString()}
                      label={e === "custom" ? "Tambah sendiri" : e.toString()}
                      value={e}
                    />
                  ))}
                </Picker>
              </View>
              {jumlahKamar === "custom" && (
                <Input
                  type="number"
                  title="Jumlah Kamar (Custom)"
                  placeholder="Masukkan jumlah kamar"
                  style={styles.input}
                  value={customJumlahKamar}
                  onChange={(value: string) => setCustomJumlahKamar(value)}
                />
              )}
              <View style={styles.radioContainer}>
                <Text style={styles.label}>Tipe Kosan</Text>
                <RadioGroup
                  layout="row"
                  radioButtons={radioButtons}
                  onPress={handleTipeKosanChange}
                  selectedId={selectedId}
                />
              </View>
              <Pressable onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Tambah Kosan</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  mainView: {
    padding: 16,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  imagePlaceholderText: {
    color: "#888",
    fontSize: 16,
  },
  imageButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  input: {
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  radioContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#4caf50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
