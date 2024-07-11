import { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

export default function CreatePostScreen() {
  const [caption, setCaption] = useState('');
  return (
    <View className="p-3 items-center flex-1">
      <Image
        source={{
          uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/1.jpg',
        }}
        className="w-52 aspect-[3/4] rounded-lg shadow-md"
      />
      <Text className="mt-5 text-xl text-blue-500 font-semibold">Change</Text>
      <TextInput
        placeholder="Write a caption..."
        className="w-full h-24 mt-5 p-3 border bg-white border-gray-200 rounded-lg"
        value={caption}
        onChangeText={setCaption}
      />
      <View className="mt-auto w-full">
        <Pressable className="bg-blue-500 w-full p-3 items-center rounded-md">
          <Text className="text-white font-semibold">Share</Text>
        </Pressable>
      </View>
    </View>
  );
}
