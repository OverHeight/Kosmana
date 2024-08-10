import React from "react";
import { View, Text, TextInput } from "react-native";
import { RadioGroup } from "react-native-radio-buttons-group";
import { Picker } from "@react-native-picker/picker";

type Props = {
  type: "text" | "radio" | "select";
  title: string;
  placeholder?: string;
  layout?: "row" | "column";
  data?: Array<any>;
  onChange: (value: any) => void;
  selectedValue?: any;
  className?: string;
};

const Input: React.FC<Props> = ({
  type,
  title,
  placeholder,
  layout = "column",
  data = [],
  onChange,
  selectedValue,
  className,
}) => {
  if (type === "text") {
    return (
      <View className={className}>
        <Text>{title}</Text>
        <TextInput
          placeholder={placeholder}
          onChangeText={(value) => onChange(value)}
          className="p-2 bg-neutral-300 rounded"
        />
      </View>
    );
  }

  if (type === "radio") {
    return (
      <View className={className}>
        <Text>{title}</Text>
        <RadioGroup
          radioButtons={data}
          onPress={(radioButtonsArray) => onChange(radioButtonsArray)}
          layout={layout}
        />
      </View>
    );
  }

  if (type === "select") {
    return (
      <View className={className}>
        <Text>{title}</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => onChange(itemValue)}
          className="p-2 border border-gray-400 rounded"
        >
          {data.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    );
  }

  return null;
};

export default Input;
