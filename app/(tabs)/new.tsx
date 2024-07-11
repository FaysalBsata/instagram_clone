import { useState } from 'react';
import { Image, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/lib/cloudinary';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import CustomButton from '../Components/CustomButton';
export default function CreatePostScreen() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const { session } = useAuth();
  const router = useRouter();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const createPost = async () => {
    if (!image) return;
    const response = await uploadImage(image);
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { caption, image: response?.public_id, user_id: session?.user?.id },
      ])
      .select();
    router.push('/(tabs)');
  };
  return (
    <View className="p-3 items-center flex-1">
      <Image
        source={{
          uri: image!,
        }}
        className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
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
        <CustomButton title="Share post" onPress={createPost} />
      </View>
    </View>
  );
}
