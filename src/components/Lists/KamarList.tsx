// components/KamarList.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { FontAwesome5, FontAwesome, Entypo } from "@expo/vector-icons";
import { DetailKamarData } from "@/types/DBtypes";
import { Image, ImageBackground } from "expo-image";
import { router } from "expo-router";
import { useDeletePenghuniKamar } from "@/api/Penghuni_KamarAPI";
import moment from "moment";
import "moment/locale/id";

const momen = moment().locale("id");

type KamarListProps = {
  listPenghuniKamar: DetailKamarData[];
  onDotPress: (KamarId: number, PenghuniId: number | null) => void;
};

const KamarList: React.FC<KamarListProps> = ({
  listPenghuniKamar,
  onDotPress,
}) => {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const sortedList = [...listPenghuniKamar].sort((a, b) => a.NoKam - b.NoKam);

  return (
    <View className="flex flex-col px-2 pb-1 pt-3 gap-y-4">
      {listPenghuniKamar.length <= 0 ? (
        <Text className="text-center">Tidak Ada kamar!</Text>
      ) : (
        sortedList.map((e) => {
          const sisaWaktu = moment(e.TanggalKeluar).diff(moment(), "days");
          return (
            <View
              key={e.KamarId}
              className="flex-col rounded-lg justify-center m-4 bg-white shadow-xl"
            >
              <View className="rounded-full">
                <ImageBackground
                  style={styles.imageBackground}
                  source={e.ImageUri}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  transition={800}
                >
                  <View className="flex-1 justify-start items-end">
                    <Pressable
                      onPress={() => onDotPress(e.KamarId, e.PenghuniId)}
                    >
                      <Entypo
                        name="dots-three-vertical"
                        size={16}
                        color="white"
                      />
                    </Pressable>
                  </View>
                  <View className="flex-1 justify-end items-end">
                    <View className="bg-emerald-600 px-4 py-1 rounded-xl">
                      <Pressable
                        onPress={
                          e.StatusKamar
                            ? () =>
                                Alert.alert(
                                  "Pilih Tindakan",
                                  "Apa anda ingin menghapus penghuni ini dari kamar atau mengedit detail penghuni kamar?",
                                  [
                                    {
                                      text: "Hapus Penghuni",
                                      onPress: () =>
                                        useDeletePenghuniKamar(
                                          e.TransId,
                                          e.KamarId
                                        ),
                                    },
                                    {
                                      text: "Edit Penghuni",
                                      onPress: () =>
                                        router.push({
                                          pathname:
                                            "/kamar/TambahPenghuni/[id]",
                                          params: {
                                            id: e.KamarId,
                                            TransId: e.TransId ?? null,
                                          },
                                        }),
                                    },
                                    {
                                      text: "Tidak",
                                      onPress: () =>
                                        console.log("Cancel Pressed"),
                                      style: "cancel",
                                    },
                                  ]
                                )
                            : () =>
                                Alert.alert(
                                  "Pilih Tindakan",
                                  "Apa anda ingin menambahkan penghuni kedalam kamar ini?",
                                  [
                                    {
                                      text: "Ya",
                                      onPress: () =>
                                        router.push({
                                          pathname:
                                            "/kamar/TambahPenghuni/[id]",
                                          params: {
                                            id: e.KamarId,
                                            penghuniKamarId: null,
                                          },
                                        }),
                                    },
                                    {
                                      text: "Tidak",
                                      onPress: () =>
                                        console.log("Cancel Pressed"),
                                      style: "cancel",
                                    },
                                  ]
                                )
                        }
                        className="flex-row gap-x-2 justify-center items-center"
                      >
                        <FontAwesome name="user" size={14} color="white" />
                        <Text className="text-white font-bold text-sm">
                          {e.StatusKamar ? e.Nama : "kosong"}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </ImageBackground>
              </View>
              <View className="py-2 gap-y-2">
                <View className=" flex-row justify-between items-center">
                  <Text className="text-emerald-600 font-bold text-base">
                    Kamar No.{e.NoKam}
                  </Text>
                  <View>
                    {e.StatusKamar ? (
                      <Pressable onPress={() => null}>
                        <View
                          className={`flex-row items-center px-3 py-1 rounded-full ${
                            e.StatusPembayaran ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          <FontAwesome5
                            name="money-bill-wave"
                            size={16}
                            color="white"
                          />
                          <Text className="text-sm text-white font-semibold ml-2">
                            {e.StatusPembayaran ? "Sudah Bayar" : "Belum Bayar"}
                          </Text>
                        </View>
                      </Pressable>
                    ) : null}
                  </View>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-800 font-bold text-base">
                    {e.Harga
                      ? Intl.NumberFormat("id-ID").format(Number(e.Harga))
                      : "belum ada harga"}{" "}
                    / bulan
                  </Text>
                </View>
                {e.StatusKamar ? (
                  <View className="flex-row justify-start items-center">
                    <Text className="text-base font-medium">
                      Jangka Kontrak:{" "}
                    </Text>
                    {(() => {
                      const endDate = moment(e.TanggalKeluar);
                      const now = moment();
                      const daysRemaining = endDate.diff(now, "days");

                      if (daysRemaining < 0) {
                        // Contract is already finished
                        return (
                          <Text className="text-base font-medium text-red-600">
                            Sudah selesai{" "}
                          </Text>
                        );
                      } else if (daysRemaining <= 7) {
                        // Contract will finish in the next 7 days
                        return (
                          <Text className="text-base font-medium text-red-600">
                            Akan selesai{" "}
                          </Text>
                        );
                      }
                      return null;
                    })()}
                    <Text
                      className={`text-base font-medium ${
                        sisaWaktu <= 7 ? "text-red-600" : null
                      }`}
                    >
                      {moment(e.TanggalKeluar).locale("id").fromNow()}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    height: 180,
    borderRadius: 8,
    flex: 1,
  },
});

export default KamarList;
