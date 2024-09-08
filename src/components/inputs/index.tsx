import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { RadioGroup } from "react-native-radio-buttons-group";
import { Picker } from "@react-native-picker/picker";

type Props = {
  type: "text" | "radio" | "select" | "number";
  value?: any;
  title: string;
  editable?: boolean;
  placeholder?: string;
  layout?: "row" | "column";
  data?: Array<any>;
  onChange: (value: any) => void;
  selectedValue?: any;
  className?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
};

const Input: React.FC<Props> = ({
  type,
  value,
  title,
  editable,
  placeholder,
  layout = "column",
  data = [],
  onChange,
  selectedValue,
  className,
  style,
  inputStyle,
}) => {
  if (type === "text") {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.label}>{title}</Text>
        <TextInput
          value={value ? value : null}
          placeholder={placeholder}
          onChangeText={(value) => onChange(value)}
          style={[styles.input, inputStyle]}
          editable={editable}
        />
      </View>
    );
  }

  if (type === "number") {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.label}>{title}</Text>
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={(value) => onChange(value)}
          style={[styles.input, inputStyle]}
          editable={editable}
          keyboardType="numeric"
        />
      </View>
    );
  }

  if (type === "radio") {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.label}>{title}</Text>
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
      <View style={[styles.container, style]}>
        <Text style={styles.label}>{title}</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => onChange(itemValue)}
          style={[styles.picker, inputStyle]}
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "gray",
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    padding: 6,
    borderRadius: 4,
    borderBottomWidth: 1,
    fontSize: 16,
  },
  picker: {
    padding: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});

export default Input;
