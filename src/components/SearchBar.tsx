// components/SearchBar.tsx
import React from "react";
import { View } from "react-native";
import { SearchBar as RNESearchBar } from "@rneui/themed";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => (
  <View className="flex-row p-2">
    <View className="w-full">
      <RNESearchBar
        platform="android"
        containerStyle={{
          height: 30,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
        inputStyle={{ fontSize: 16 }}
        inputContainerStyle={{ height: 5 }}
        onChangeText={onChangeText}
        value={value}
        placeholder="Cari Nama disini..."
      />
    </View>
  </View>
);

export default SearchBar;
