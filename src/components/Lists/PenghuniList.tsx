// components/PenghuniListItem.tsx
import React, { useState } from "react";
import { View, Text, Pressable, Image, TouchableOpacity } from "react-native";
import Accordion from "@/components/Accordion";
import { PenghuniData } from "@/types/DBtypes";
import * as Clipboard from "expo-clipboard";
import { Entypo } from "@expo/vector-icons";

interface PenghuniListItemProps {
  item: PenghuniData;
  option?: boolean;
  onRoomPress?: () => void;
  onImagePress: (imageUri: string) => void;
  onMorePress: (id: number) => void;
}

const PenghuniListItem: React.FC<PenghuniListItemProps> = ({
  item,
  onRoomPress,
  onImagePress,
  onMorePress,
}) => {
  const [isFotoVisible, setIsFotoVisible] = useState<boolean>(false);
  const [isFoto2Visible, setIsFoto2Visible] = useState<boolean>(false);
  const handleMore = async (id: number) => {
    await onMorePress(id);
  };

  return (
    <Accordion
      title={item.Nama}
      penggunaId={Number(item.Id)}
      options={true}
      optionPress={(e: number) => handleMore(e)}
    >
      <View className="flex-col">
        <View className="flex-row items-center">
          <Text className="text-base font-semibold">Nama: </Text>
          <Text className="text-base text-gray-700 font-medium">
            {item.Nama}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-base font-semibold">Umur: </Text>
          <Text className="text-base text-gray-700 font-medium">
            {item.Umur}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-base font-semibold">Jenis Kelamin: </Text>
          <Text className="text-base text-gray-700 font-medium">
            {item.JenisKelamin}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-base font-semibold">Nomor Telepon: </Text>
          <TouchableOpacity
            onLongPress={() => Clipboard.setStringAsync(item.NoTelp)}
          >
            <Text className="text-base text-gray-700 font-medium">
              {item.NoTelp}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-col">
          <TouchableOpacity
            onPress={() => setIsFotoVisible(!isFotoVisible)}
            className="flex p-3 my-2 justify-center items-center bg-blue-500 w-[40%] rounded-xl"
          >
            <Text className="text-md font-bold text-white">
              Lihat Foto Penghuni
            </Text>
          </TouchableOpacity>
          {isFotoVisible ? (
            item.FotoPenghuni === "" ? (
              <View className="flex w-[50%] justify-center items-start">
                <Text className="text-base text-red-500 font-medium">
                  Belum ada Foto Penghuni!
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={() =>
                  item.FotoPenghuni ? onImagePress(item.FotoPenghuni) : null
                }
              >
                <Image
                  source={{ uri: item.FotoPenghuni }}
                  style={{
                    width: "100%",
                    height: 300,
                    alignSelf: "center",
                    marginVertical: 4,
                  }}
                />
              </Pressable>
            )
          ) : null}
        </View>
        <View className="flex-col">
          <TouchableOpacity
            onPress={() => setIsFoto2Visible(!isFoto2Visible)}
            className="flex p-3 my-2 justify-center items-center bg-blue-500 w-[40%] rounded-xl"
          >
            <Text className="text-md font-bold text-white">Lihat Foto KTP</Text>
          </TouchableOpacity>
          {isFoto2Visible ? (
            item.FotoKTP === "" ? (
              <View className="flex w-[50%] justify-center items-start">
                <Text className="text-base text-red-500 font-medium">
                  Belum ada Foto KTP!
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={() =>
                  item.FotoKTP ? onImagePress(item.FotoKTP) : null
                }
              >
                <Image
                  source={{ uri: item.FotoKTP }}
                  style={{
                    width: "100%",
                    height: 225,
                    alignSelf: "center",
                    marginVertical: 4,
                  }}
                />
              </Pressable>
            )
          ) : null}
        </View>
      </View>
    </Accordion>
  );
};
export default PenghuniListItem;
