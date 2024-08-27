import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Alert,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useDeletePenghuni } from "@/api/PenghuniAPI";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  penggunaId: number;
  options?: boolean;
  optionPress?: (penggunaId: number) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  penggunaId,
  options,
  optionPress,
}) => {
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
      <View className="flex-row justify-between">
        <TouchableOpacity
          onLongPress={handleHold}
          onPress={toggleExpand}
          className={`flex-row justify-between items-center px-4 py-2 bg-white ${
            options ? "w-[85%]" : "w-full"
          } `}
        >
          <Text className="text-base font-semibold">{title}</Text>
        </TouchableOpacity>
        {options ? (
          <TouchableOpacity
            onPress={() => optionPress?.(penggunaId)}
            className="flex w-[15%] bg-white justify-center items-center"
          >
            <Entypo name="dots-three-horizontal" size={16} color="black" />
          </TouchableOpacity>
        ) : null}
      </View>
      {expanded && <View className="p-4 bg-gray-100">{children}</View>}
    </View>
  );
};

export default Accordion;
