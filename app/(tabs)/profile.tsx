import { useState } from 'react';
import { Image, Pressable, TextInput, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/Components/CustomButton';
import { supabase } from '@/lib/supabase';
export default function ProfileScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <View className="flex-1 p-3">
      <Pressable onPress={pickImage}>
        <Image
          source={{
            uri: image!,
          }}
          className="w-52 aspect-square self-center rounded-full bg-slate-300"
        />
      </Pressable>
      <Text className="text-gray-500 font-semibold mb-2">Username</Text>
      <TextInput
        placeholder="User Name"
        className="h-12 p-3 border bg-white border-gray-200 rounded-lg"
        value={userName}
        onChangeText={setUserName}
      />
      <View className="gap-2 mt-auto">
        <CustomButton title="Save" onPress={() => {}} />
        <CustomButton
          title="Logout"
          onPress={() => {
            supabase.auth.signOut();
          }}
        />
      </View>
    </View>
  );
}
