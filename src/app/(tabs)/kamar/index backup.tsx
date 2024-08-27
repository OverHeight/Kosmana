import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import BackHeaders from "@/components/layouts/BackHeaders";
import { Entypo, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  KosanData,
  KamarData,
  PenghuniData,
  PenghuniKamarData,
} from "@/types/DBtypes";

type KamarPickerProps = {
  listKosan: KosanData[];
  kosan: number;
  onSelectKosan: (value: number) => void;
  onAddKamar: () => void;
};

const KamarPicker: React.FC<KamarPickerProps> = ({
  listKosan,
  kosan,
  onSelectKosan,
  onAddKamar,
}) => (
  <View className="flex-row justify-between w-screen h-max px-2 bg-emerald-600">
    <Picker
      selectedValue={kosan}
      onValueChange={onSelectKosan}
      style={{ color: "white", maxWidth: 200 }}
    >
      {listKosan.map((e) => (
        <Picker.Item key={e.Id} label={e.NamaKosan} value={e.Id} />
      ))}
    </Picker>
    <Pressable
      onPress={onAddKamar}
      className="h-8 w-10 my-2 mr-2 justify-center items-center bg-emerald-500 rounded-full"
    >
      <Entypo name="plus" size={16} color="white" />
    </Pressable>
  </View>
);

type KamarItemProps = {
  kamar: KamarData;
  penghuni: PenghuniData | null;
  onLongPress: () => void;
  onAddPenghuni: () => void;
};

const KamarItem: React.FC<KamarItemProps> = ({
  kamar,
  penghuni,
  onLongPress,
  onAddPenghuni,
}) => (
  <Pressable onLongPress={onLongPress} key={kamar.Id}>
    <View className="bg-neutral-50 p-4 flex-col rounded-lg border border-gray-200 shadow-sm">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xl font-semibold text-gray-700">
          Kamar No.{kamar.NoKam}
        </Text>
      </View>
      <Pressable
        onPress={onAddPenghuni}
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

type ModalOptionsProps = {
  isModalVisible: boolean;
  isModal2Visible: boolean;
  onToggleModal: () => void;
  onHapusKamar: () => void;
  onHapusPenghuni: () => void;
  listPenghuni: PenghuniData[];
  onSelectPenghuni: (id: number) => void;
};

const ModalOptions: React.FC<ModalOptionsProps> = ({
  isModalVisible,
  isModal2Visible,
  onToggleModal,
  onHapusKamar,
  onHapusPenghuni,
  listPenghuni,
  onSelectPenghuni,
}) => (
  <Modal
    onBackButtonPress={onToggleModal}
    isVisible={isModalVisible}
    backdropOpacity={0.3}
  >
    <View className="flex justify-center items-center rounded-2xl p-4 bg-white">
      {isModal2Visible ? (
        <View className="flex justify-center items-center divide-y-2 divide-gray-600">
          <Pressable onPress={onHapusKamar} className="p-4 w-full">
            <Text className="text-lg font-bold">Hapus Kamar</Text>
          </Pressable>
          <Pressable onPress={onHapusPenghuni} className="p-4 w-full">
            <Text className="text-lg font-bold">Hapus Penghuni</Text>
          </Pressable>
        </View>
      ) : (
        listPenghuni.map((e) => (
          <Pressable
            key={e.Id}
            onPress={() => onSelectPenghuni(Number(e.Id))}
            className="w-full py-2 items-center"
          >
            <Text className="text-lg font-semibold">{e.Nama}</Text>
          </Pressable>
        ))
      )}
    </View>
  </Modal>
);

type KamarPageProps = {
  listKosan: KosanData[];
  listKamar: KamarData[];
  listPenghuni: PenghuniData[];
  listPenghuniKamar: PenghuniKamarData[];
  refreshing: boolean;
  kosan: number;
  onSelectKosan: (value: number) => void;
  onAddKamar: () => void;
  onHapusKamar: (id: number) => void;
  onHapusPenghuni: (id: number) => void;
  onRefresh: () => void;
  onToggleModal: () => void;
  isModalVisible: boolean;
  isModal2Visible: boolean;
  penghuniByKamarId: Record<number, PenghuniData | null>;
};

const KamarPage: React.FC<KamarPageProps> = ({
  listKosan,
  listKamar,
  listPenghuni,
  listPenghuniKamar,
  refreshing,
  kosan,
  onSelectKosan,
  onAddKamar,
  onHapusKamar,
  onHapusPenghuni,
  onRefresh,
  onToggleModal,
  isModalVisible,
  isModal2Visible,
  penghuniByKamarId,
}) => {
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
        <ModalOptions
          isModalVisible={isModalVisible}
          isModal2Visible={isModal2Visible}
          onToggleModal={onToggleModal}
          onHapusKamar={() => onHapusKamar(kosan)}
          onHapusPenghuni={() => onHapusPenghuni(kosan)}
          listPenghuni={listPenghuni}
          onSelectPenghuni={(id) => console.log("Penghuni Selected:", id)}
        />
        {listKosan ? (
          <Text className="text-lg text-center font-bold text-red-500 my-5">
            Tambahkan kosan terlebih dahulu!
          </Text>
        ) : (
          <KamarPicker
            listKosan={listKosan}
            kosan={kosan}
            onSelectKosan={onSelectKosan}
            onAddKamar={onAddKamar}
          />
        )}
        <View className="flex flex-col px-2 pb-1 pt-3 gap-y-4">
          {listKamar.length <= 0 ? (
            <Text className="text-center">Tidak Ada kamar!</Text>
          ) : (
            listKamar.map((kamar) => (
              <KamarItem
                key={kamar.Id}
                kamar={kamar}
                penghuni={penghuniByKamarId[Number(kamar.Id)]}
                onLongPress={() => console.log("Hold Kamar:", kamar.Id)}
                onAddPenghuni={() => console.log("Add Penghuni:", kamar.Id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default KamarPage;
