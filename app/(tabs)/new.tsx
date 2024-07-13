import { useEffect, useState } from 'react';
import { Image, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadMedia } from '@/lib/cloudinary';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import CustomButton from '../Components/CustomButton';
import { Video, ResizeMode } from 'expo-av';
export default function CreatePostScreen() {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | undefined>(
    undefined
  );
  const { session } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!media) {
      pickImage();
    }
  }, [media]);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
      setMediaType(result.assets[0].type);
    }
  };

  const createPost = async () => {
    if (!media) return;
    const response = await uploadMedia(media);
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          caption,
          image: response?.public_id,
          user_id: session?.user?.id,
          media_type: mediaType,
        },
      ])
      .select();
    router.push('/(tabs)');
  };
  return (
    <View className="p-3 items-center flex-1">
      {!media ? (
        <View className="w-52 h-52 bg-slate-300 rounded-lg" />
      ) : mediaType === 'video' ? (
        <Video
          style={{ width: '100%', aspectRatio: 16 / 9 }}
          source={{
            uri: media,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
        />
      ) : (
        <Image
          source={{
            uri: media,
          }}
          className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
        />
      )}

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
