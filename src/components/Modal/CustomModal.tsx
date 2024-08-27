// components/CustomModal.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import Modal from "react-native-modal";

type CustomModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  return (
    <Modal onBackButtonPress={onClose} isVisible={isVisible}>
      <View className="flex justify-start items-center rounded-2xl bg-white">
        {children}
      </View>
    </Modal>
  );
};

export default CustomModal;
