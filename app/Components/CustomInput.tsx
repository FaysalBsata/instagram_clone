import { View, Text, TextInput, TextInputProps } from 'react-native';
import React from 'react';

type CustomInputProps = TextInputProps & {
  label: string;
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  ...textInputProps
}) => {
  return (
    <View>
      <Text className="text-gray-500 font-semibold mb-2">{label}</Text>
      <TextInput
        className="h-12 p-3 border bg-white border-gray-200 rounded-lg"
        {...textInputProps}
      />
    </View>
  );
};

export default CustomInput;
