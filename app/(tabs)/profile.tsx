import { useEffect, useState } from 'react';
import { Image, Pressable, TextInput, View, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import CustomButton from '../Components/CustomButton';
import { useAuth } from '@/providers/AuthProvider';
import CustomInput from '../Components/CustomInput';
export default function ProfileScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const { user } = useAuth();
  useEffect(() => {
    getProfile();
  }, []);
  async function getProfile() {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) {
      Alert.alert(error.message);
    }

    if (data) {
      setUserName(data.username);
      setImage(data.avatar_url);
      setBio(data.bio);
    }
  }
  async function updateProfile() {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, username: userName, avatar_url: image, bio });
    if (error) {
      Alert.alert(error.message);
    }
    Alert.alert('Profile Updated');
  }
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
      <View className="gap-12">
        <CustomInput
          label="Username"
          placeholder="User Name"
          value={userName}
          onChangeText={setUserName}
        />
        <CustomInput
          label="Bio"
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
        />
      </View>
      <View className="gap-2 mt-auto">
        <CustomButton title="Save" onPress={updateProfile} />
        <CustomButton
          color="red"
          title="Logout"
          onPress={() => {
            supabase.auth.signOut();
          }}
        />
      </View>
    </View>
  );
}
