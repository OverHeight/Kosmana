import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { Modal } from "react-native";
import { Input } from "@rneui/base";
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group";
import { PenghuniData } from "@/types/DBtypes";
import * as ImagePicker from "expo-image-picker";

interface AddPenghuniModalProps {
  visible: boolean;
  toggleModal: () => void;
  isEditing: boolean;
  onSubmit: (penghuniData: PenghuniData) => void;
  dataEdit?: Partial<PenghuniData> | null;
  onShow?: () => void;
}

const AddPenghuniModal: React.FC<AddPenghuniModalProps> = ({
  visible,
  toggleModal,
  isEditing,
  onSubmit,
  dataEdit,
  onShow,
}) => {
  const [payload, setPayload] = useState<Partial<PenghuniData>>({
    Id: undefined,
    Nama: "",
    Umur: 0,
    JenisKelamin: null,
    NoTelp: "",
    FotoPenghuni: "",
    FotoKTP: "",
  });

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      { id: "1", label: "Laki-Laki", value: "Laki-Laki" },
      { id: "2", label: "Perempuan", value: "Perempuan" },
    ],
    []
  );

  const resetPayload = useCallback(() => {
    setPayload({
      Id: undefined,
      Nama: "",
      Umur: null,
      JenisKelamin: "",
      NoTelp: "",
      FotoPenghuni: "",
      FotoKTP: "",
    });
  }, []);
  console.log("Reseted payload");
  useEffect(() => {
    if (visible) {
      if (isEditing && dataEdit) {
        setPayload({
          Id: dataEdit.Id,
          Nama: dataEdit.Nama || "",
          Umur: dataEdit.Umur || 0,
          JenisKelamin: dataEdit.JenisKelamin || "",
          NoTelp: dataEdit.NoTelp || "",
          FotoPenghuni: dataEdit.FotoPenghuni || "",
          FotoKTP: dataEdit.FotoKTP || "",
        });
      } else {
        resetPayload();
      }
    }
  }, [visible, onShow]);

  const handleChange = useCallback((name: keyof PenghuniData, value: any) => {
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleJenisKelaminChange = useCallback(
    (selectedId: string) => {
      const selectedButton = radioButtons.find(
        (button) => button.id === selectedId
      );
      handleChange("JenisKelamin", selectedButton?.value);
    },
    [radioButtons, handleChange]
  );

  const pickImage = useCallback(
    async (field: "FotoPenghuni" | "FotoKTP") => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: field === "FotoPenghuni" ? [3, 4] : [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        handleChange(field, result.assets[0].uri);
      }
    },
    [handleChange]
  );

  const handleSubmit = useCallback(async () => {
    try {
      if (
        !payload.Nama ||
        !payload.NoTelp ||
        !payload.JenisKelamin ||
        !payload.Umur
      ) {
        Alert.alert("Error", "Harap isi semua formulir!");
        return;
      }

      const penghuniData: PenghuniData = {
        Id: isEditing ? payload.Id : undefined,
        Nama: payload.Nama,
        Umur: Number(payload.Umur),
        JenisKelamin: payload.JenisKelamin,
        NoTelp: payload.NoTelp,
        FotoPenghuni: payload.FotoPenghuni,
        FotoKTP: payload.FotoKTP,
      };

      toggleModal();
      if (onSubmit) {
        onSubmit(penghuniData);
      }
    } catch (error) {
      console.error("Payload: ", payload);
      console.error("Gagal menambahkan penghuni: ", error);
      Alert.alert("Gagal", "Gagal menambahkan penghuni");
    }
  }, [payload, toggleModal, onSubmit, isEditing]);

  return (
    <Modal
      visible={visible}
      onRequestClose={toggleModal}
      animationType="fade"
      transparent={true}
      style={{ margin: 0 }}
    >
      <View className="flex-1 justify-center items-center bg-black/70">
        <View className="flex bg-white justify-center items-center self-center rounded-xl w-[95%] max-h-[80%]">
          <ScrollView className="p-5 w-screen">
            <View className="pt-2 pb-4">
              <Text className="text-lg font-bold text-center">
                Tambah Penghuni
              </Text>
            </View>
            <View className="w-full mb-4">
              <Input
                value={payload.Nama}
                onChangeText={(value) => handleChange("Nama", value)}
                placeholder="Masukan Nama"
                label="Nama"
              />
            </View>
            <View className="w-full mb-4">
              <Input
                value={payload.Umur?.toString()}
                onChangeText={(value) => handleChange("Umur", value)}
                placeholder="Masukan Umur"
                label="Umur"
                keyboardType="numeric"
              />
            </View>
            <View className="w-full mx-3 mb-4">
              <Text className="text-base font-bold text-gray-400 mb-2">
                Jenis Kelamin
              </Text>
              <RadioGroup
                layout="row"
                radioButtons={radioButtons}
                onPress={handleJenisKelaminChange}
                selectedId={
                  payload.JenisKelamin
                    ? payload.JenisKelamin === "Laki-Laki"
                      ? "1"
                      : "2"
                    : undefined
                }
              />
            </View>
            <View className="w-full mb-4">
              <Input
                value={payload.NoTelp}
                onChangeText={(value) => handleChange("NoTelp", value)}
                placeholder="Masukan Nomor Telepon"
                label="Nomor Telepon"
              />
            </View>
            <View className="w-[95%] self-center mb-4">
              <Text className="text-base font-bold text-gray-400 mb-2">
                Foto Penghuni
              </Text>
              {payload.FotoPenghuni ? (
                <Image
                  source={{ uri: payload.FotoPenghuni }}
                  style={{
                    width: "100%",
                    height: 200,
                    resizeMode: "cover",
                  }}
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: 200,
                    backgroundColor: "#e1e1e1",
                  }}
                />
              )}
              <Button
                color="green"
                title="Pilih Foto Penghuni"
                onPress={() => pickImage("FotoPenghuni")}
              />
            </View>
            <View className="w-[95%] self-center mb-4">
              <Text className="text-base font-bold text-gray-400 mb-2">
                Foto KTP
              </Text>
              {payload.FotoKTP ? (
                <Image
                  source={{ uri: payload.FotoKTP }}
                  style={{
                    width: "100%",
                    height: 190,
                    resizeMode: "cover",
                  }}
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: 190,
                    backgroundColor: "#e1e1e1",
                  }}
                />
              )}
              <Button
                title="Pilih Foto KTP"
                onPress={() => pickImage("FotoKTP")}
              />
            </View>
          </ScrollView>
          <View className="flex-row w-[90%] rounded-xl gap-x-2 justify-end p-4">
            <Pressable
              onPress={toggleModal}
              className="border border-neutral-700 py-3 justify-center items-center w-[30%] rounded-xl"
            >
              <Text className="text-base font-medium text-black">Batal</Text>
            </Pressable>
            {isEditing ? (
              <Pressable
                onPress={handleSubmit}
                className="bg-green-500 py-3 justify-center items-center w-[30%] rounded-xl"
              >
                <Text className="text-base font-medium text-white">Ubah</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleSubmit}
                className="bg-green-500 py-3 justify-center items-center w-[30%] rounded-xl"
              >
                <Text className="text-base font-medium text-white">Tambah</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddPenghuniModal;
