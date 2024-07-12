import { useEffect, useState } from 'react';
import { Image, Pressable, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import CustomButton from '../Components/CustomButton';
import { useAuth } from '@/providers/AuthProvider';
import CustomInput from '../Components/CustomInput';
import { cld, uploadImage } from '@/lib/cloudinary';
import { AdvancedImage } from 'cloudinary-react-native';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
export default function ProfileScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [remoteImage, setRemoteImage] = useState<string | null>(null);
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
    console.log(data);
    if (data) {
      setUserName(data.username);
      setRemoteImage(data.avatar_url);
      setBio(data.bio);
    }
  }
  const updatedProfile = {
    id: user?.id,
    username: userName,
    avatar_url: image,
    bio,
  };
  async function updateProfile() {
    if (!user) return;
    if (image) {
      const response = await uploadImage(image);
      updatedProfile.avatar_url = response?.public_id;
    }
    const { data, error } = await supabase
      .from('profiles')
      .upsert(updatedProfile);
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
  let remoteCloudinaryImage;
  if (remoteImage) {
    remoteCloudinaryImage = cld.image(remoteImage);
    remoteCloudinaryImage.resize(thumbnail().width(300).height(300));
  }
  return (
    <View className="flex-1 p-3">
      <Pressable onPress={pickImage}>
        {remoteImage && remoteCloudinaryImage ? (
          <AdvancedImage
            cldImg={remoteCloudinaryImage}
            className="w-52 aspect-square self-center rounded-full "
          />
        ) : (
          <Image
            source={{
              uri: image!,
            }}
            className="w-52 aspect-square self-center rounded-full bg-slate-300"
          />
        )}
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
