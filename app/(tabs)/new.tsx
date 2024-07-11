import { useEffect, useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
export default function CreatePostScreen() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  useEffect(() => {
    if (!image) {
      pickImage();
    }
  }, []);
  return (
    <View className="p-3 items-center flex-1">
      <Image
        source={{
          uri: image!,
        }}
        className="w-52 aspect-[3/4] rounded-lg shadow-md bg-slate-300"
      />
      <Text
        onPress={pickImage}
        className="mt-5 text-xl text-blue-500 font-semibold"
      >
        Change
      </Text>
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
