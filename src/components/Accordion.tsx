import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDeletePenghuni } from "@/api/PenghuniAPI";

const Accordion = ({ title, children, penggunaId }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  const handleHold = () => {
    Alert.alert("Hapus Penghuni", "Anda yakin ingin menghapus penghuni ini?", [
      {
        text: "Batal",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => useDeletePenghuni(penggunaId) },
    ]);
  };
  return (
    <View className="border-b border-gray-300 overflow-hidden">
      <TouchableOpacity
        onLongPress={handleHold}
        onPress={toggleExpand}
        className={"flex-row justify-between items-center px-4 py-2 bg-white"}
      >
        <Text className="text-base font-semibold">{title}</Text>
      </TouchableOpacity>
      {expanded && <View className="p-4 bg-gray-100">{children}</View>}
    </View>
  );
};

export default Accordion;
