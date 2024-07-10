import { Image, Text, View } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
type PostListItemProps = {
  post: any;
};

const PostListItem = ({ post }: PostListItemProps) => {
  return (
    <View className="bg-white">
      <View className="p-2 flex-row items-center gap-2">
        <Image
          source={{ uri: post.user.image_url }}
          className="w-12 aspect-square rounded-full"
        />
        <Text className="font-semibold">{post.user.username}</Text>
      </View>
      <Image source={{ uri: post.image_url }} className="w-full aspect-[4/3]" />
      <View className="p-3">
        <View className="flex-row gap-3">
          <AntDesign name="hearto" size={20} />
          <Ionicons name="chatbubble-outline" size={20} />
          <Feather name="send" size={20} />
          <Feather name="bookmark" size={20} className="ml-auto" />
        </View>
      </View>
    </View>
  );
};

export default PostListItem;
