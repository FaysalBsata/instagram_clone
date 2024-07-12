import { View, Text, Pressable } from 'react-native';
import React from 'react';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
};

const CustomButton = ({
  title,
  onPress,
  disabled,
  color,
}: CustomButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${
        color === 'red' ? 'bg-red-600' : 'bg-blue-500'
      } w-full p-3 items-center rounded-md`}
    >
      <Text className="text-white font-semibold">{title}</Text>
    </Pressable>
  );
};

export default CustomButton;
