import React, { useEffect, useState } from "react";
import { View, Text, Image, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import BackHeaders from "@/components/layouts/BackHeaders";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useGetKamarById, useUpdateKamar } from "@/api/kamarAPI";
import { KamarData } from "@/types/DBtypes";
import * as ImagePicker from "expo-image-picker";
import { useKamarData } from "@/hooks/useKamarData";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Input } from "@rneui/base";

const editKamar = () => {
  const { id } = useLocalSearchParams();
  const { onRefresh } = useKamarData();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
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

  const handleSave = async () => {
    console.log("pressed Save");
    try {
      await useUpdateKamar(payload as KamarData);
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
      <ScrollView className="flex-1 bg-neutral-100">
        <View className="flex-col bg-neutral-100 p-4">
          <View className="my-2">
            {payload.ImageUri ? (
              <Image
                source={{ uri: payload.ImageUri }}
                style={{
                  width: 320,
                  height: 180,
                  alignSelf: "center",
                  marginVertical: 2,
                  borderRadius: 8,
                }}
              />
            ) : (
              <View
                style={{
                  width: 320,
                  height: 180,
                  backgroundColor: "#e1e1e1",
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 2,
                  borderRadius: 8,
                }}
              >
                <Text className="text-gray-400 font-medium text-base">
                  Belum ada foto
                </Text>
              </View>
            )}
            <Button
              title="Pilih Foto Kamar"
              onPress={pickImage}
              buttonStyle={{
                backgroundColor: "#4CAF50",
                borderRadius: 8,
                padding: 8,
              }}
              titleStyle={{
                fontWeight: "bold",
              }}
              containerStyle={{
                marginTop: 16,
                width: "100%",
              }}
            />
          </View>
          <View className="p-6 shadow-md bg-white rounded-lg">
            <Input
              keyboardType="number-pad"
              label="Nomor Kamar"
              value={payload.NoKam?.toString()}
              placeholder="Nomor Kamar"
              onChangeText={(value) => handleChange("NoKam", Number(value))}
            />
            <Input
              keyboardType="number-pad"
              label="Harga"
              value={payload.Harga?.toString()}
              placeholder="Harga"
              onChangeText={(value) => handleChange("Harga", Number(value))}
            />
          </View>
        </View>
        <View className="px-4">
          <Button
            title="Simpan"
            onPress={handleSave}
            buttonStyle={{
              backgroundColor: "#41980A",
              borderRadius: 8,
              padding: 12,
            }}
            titleStyle={{
              fontWeight: "bold",
            }}
            containerStyle={{
              width: "100%",
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default editKamar;
