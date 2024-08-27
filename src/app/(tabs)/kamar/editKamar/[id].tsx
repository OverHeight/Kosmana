import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import BackHeaders from "@/components/layouts/BackHeaders";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useGetKamarById, useUpdateKamar } from "@/api/kamarAPI";
import { KamarData } from "@/types/DBtypes";
import { Button as RNEButton } from "@rneui/base";
import Input from "@/components/inputs";
import * as ImagePicker from "expo-image-picker";
import { useKamarData } from "@/hooks/useKamarData";

const Index = () => {
  const { id } = useLocalSearchParams();
  const { onRefresh } = useKamarData();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [payload, setPayload] = useState<Partial<KamarData>>({
    Id: 0,
    KosanId: 0,
    NoKam: 0,
    Harga: null,
    ImageUri: null,
  });

  useEffect(() => {
    const fetchKamarData = async () => {
      try {
        setIsLoading(true);
        const kamarData = await useGetKamarById(Number(id));
        if (kamarData) {
          setPayload({
            Id: Number(id),
            KosanId: kamarData.KosanId,
            NoKam: kamarData.NoKam,
            Harga: kamarData.Harga,
            ImageUri: kamarData.ImageUri,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchKamarData();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await useUpdateKamar(payload as KamarData);
      setIsEditing(false);
      router.back();
      onRefresh();
      console.log("Kamar data updated successfully");
      Alert.alert("Sukses", "Data kamar sudah diupdate");
    } catch (err) {
      console.error("Error updating kamar data:", err);
      Alert.alert("Error", "Failed to update room data");
    }
  };

  const handleChange = (name: keyof KamarData, value: any) => {
    console.log(name, value);
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      handleChange("ImageUri", result.assets[0].uri);
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <SafeAreaProvider>
      <BackHeaders judul="Edit Kamar" />
      <View className="flex-1 bg-white">
        <View className="flex-col bg-gray-200 p-4">
          <Text className="text-xl font-bold text-center">Informasi Kamar</Text>
          <View className="space-y-4">
            <Input
              type="text"
              title="Nomor Kamar"
              value={payload.NoKam?.toString()}
              placeholder="Nomor Kamar"
              onChange={(text) => handleChange("NoKam", Number(text))}
              className="border rounded-lg"
              editable={isEditing}
            />
            <Input
              type="text"
              title="Harga"
              value={payload.Harga?.toString()}
              placeholder="Harga"
              onChange={(text) => handleChange("Harga", Number(text))}
              className="border rounded-lg"
              editable={isEditing}
            />
            <View>
              <Text>Foto Kamar</Text>
              {payload.ImageUri ? (
                <Image
                  source={{ uri: payload.ImageUri }}
                  style={{
                    width: 320,
                    height: 180,
                    alignSelf: "center",
                    marginVertical: 4,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 320,
                    height: 180,
                    backgroundColor: "#e1e1e1",
                    alignSelf: "center",
                    marginVertical: 4,
                  }}
                />
              )}
              {isEditing && <Button title="Pilih Foto" onPress={pickImage} />}
            </View>
          </View>
        </View>
        <View className="flex-row justify-end p-4">
          {isEditing ? (
            <RNEButton onPress={handleSave} title="Simpan" />
          ) : (
            <RNEButton onPress={handleEdit} title="Edit" />
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default Index;
