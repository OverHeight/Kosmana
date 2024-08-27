import { View, Text } from "react-native";
import React from "react";
import Modal from "react-native-modal";

interface modalProp {
  isVisible: any;
  onBackButtonPress: any;
}

const ModalTambahPenghuni = (data: modalProp) => {
  return (
    <Modal
      onBackButtonPress={data.onBackButtonPress}
      isVisible={data.isVisible}
      className="p-20"
    >
      <View className="text-xl text-black">test</View>
    </Modal>
  );
};

export default ModalTambahPenghuni;
