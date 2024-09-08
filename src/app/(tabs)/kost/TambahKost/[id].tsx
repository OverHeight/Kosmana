import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Alert,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group";
import { Picker } from "@react-native-picker/picker";
import Input from "@/components/inputs";
import {
  useCreateKosan,
  useUpdateKosan,
  useGetKosanById,
} from "@/api/kosanAPI";
import { useCreateKamar } from "@/api/kamarAPI";
import { KamarData, KosanData } from "@/types/DBtypes";
import { router, useLocalSearchParams } from "expo-router";
import BackHeaders from "@/components/layouts/BackHeaders";

type JumlahKamarType = number | "custom";

export default function TambahKost() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (Number(id) === 0 || null || NaN) {
      setIsEditing(false);
    } else if (Number(id) > 0) {
      setIsEditing(true);
    }
  }, [id]);
  console.log("id: ", Number(id));
  console.log(isEditing);

  const [payload, setPayload] = useState<Partial<KosanData>>({
    NamaKosan: "",
    Harga: null,
    Kota: "",
    Alamat: "",
  });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tipeKosan, setTipeKosan] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [jumlahKamar, setJumlahKamar] = useState<JumlahKamarType>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [customJumlahKamar, setCustomJumlahKamar] = useState<string>("");

  useEffect(() => {
    if (isEditing) {
      fetchKosanData();
    }
  }, [isEditing]);

  const fetchKosanData = async () => {
    try {
      const kosanData = await useGetKosanById(Number(id));
      if (kosanData) {
        setPayload(kosanData);
        setImageUri(kosanData.ImageUri || null);
        setTipeKosan(kosanData.TipeKosan);
        setSelectedId(kosanData.TipeKosan === "Laki-Laki" ? "1" : "2");
        setJumlahKamar(kosanData.JumlahKamar);
      }
    } catch (error) {
      console.error("Error fetching kosan data:", error);
      Alert.alert("Error", "Failed to fetch kosan data");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
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
    if (name === "Harga") {
      const numericValue = parseFloat(value.replace(/,/g, ""));
      setPayload((prev) => ({
        ...prev,
        [name]: isNaN(numericValue) ? 0 : numericValue,
      }));
    } else {
      setPayload((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    setIsDisabled(true);
    try {
      if (!imageUri) {
        Alert.alert("Error", "Tambahkan gambar Kosan!");
        setIsDisabled(false);
        return;
      }

      let finalJumlahKamar: number;
      if (jumlahKamar === "custom") {
        finalJumlahKamar = parseInt(customJumlahKamar.replace(/,/g, ""), 10);
      } else {
        finalJumlahKamar = jumlahKamar as number;
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

      if (isEditing) {
        await useUpdateKosan(Number(id), kosanData);
      } else {
        const kosanId = await useCreateKosan(kosanData);
        await createKamar(kosanId, finalJumlahKamar);
      }

      setIsDisabled(false);
      router.back();
      Alert.alert(
        "Sukses",
        `Sukses ${isEditing ? "mengubah" : "menambah"} data Kosan dan Kamar`
      );
    } catch (error) {
      setIsDisabled(false);
      console.error(
        `Gagal ${isEditing ? "mengubah" : "menambahkan"} kosan atau kamar: `,
        error
      );
      Alert.alert(
        "Gagal",
        `Gagal ${isEditing ? "mengubah" : "menambahkan"} kosan atau kamar`
      );
    }
  };

  const createKamar = async (kosanId: number, jumlahKamar: number) => {
    for (let i = 1; i <= jumlahKamar; i++) {
      const kamarPayload: KamarData = {
        KosanId: kosanId,
        Harga: payload.Harga,
        NoKam: i,
      };
      await useCreateKamar(kamarPayload);
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
        <BackHeaders
          aksi={""}
          judul={isEditing ? "Edit Kost" : "Tambah Kost"}
        />
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
                <Text style={styles.imageButtonText}>Pilih Foto Kosan</Text>
              </Pressable>
            </View>
            <View style={styles.formContainer}>
              <Input
                type="text"
                title="Nama Kosan"
                placeholder="Input Nama Kosan disini"
                style={styles.input}
                value={payload.NamaKosan}
                onChange={(value: any) => handleChange("NamaKosan", value)}
              />
              <Input
                type="text"
                title="Kota"
                placeholder="Input Kota disini"
                style={styles.input}
                value={payload.Kota}
                onChange={(value: any) => handleChange("Kota", value)}
              />
              <Input
                type="text"
                title="Alamat"
                placeholder="Input Alamat disini"
                style={styles.input}
                value={payload.Alamat}
                onChange={(value: any) => handleChange("Alamat", value)}
              />
              <Input
                type="number"
                title="Harga"
                placeholder="Input Harga disini"
                value={payload.Harga?.toString()}
                onChange={(value: string) => handleChange("Harga", value)}
              />
              {isEditing ? null : (
                <View style={styles.pickerContainer}>
                  <Text style={styles.label}>Jumlah Kamar</Text>
                  <Picker
                    selectedValue={jumlahKamar}
                    onValueChange={(value: JumlahKamarType) =>
                      setJumlahKamar(value)
                    }
                    style={styles.picker}
                  >
                    {NoKam.map((value) => (
                      <Picker.Item
                        key={value.toString()}
                        label={
                          value === "custom"
                            ? "Tambah sendiri"
                            : value.toString()
                        }
                        value={value}
                      />
                    ))}
                  </Picker>
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
                </View>
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
              <Pressable
                disabled={isDisabled}
                onPress={handleSubmit}
                style={[
                  styles.submitButton,
                  isDisabled && styles.disabledButton,
                ]}
              >
                {isDisabled ? (
                  <ActivityIndicator size="large" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isEditing ? "Update" : "Tambah"} Kosan
                  </Text>
                )}
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
    width: 320,
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 320,
    height: 180,
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
  disabledButton: {
    backgroundColor: "#7fba7f",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
