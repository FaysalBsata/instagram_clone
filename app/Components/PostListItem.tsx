import { Pressable, Text, View } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { AdvancedImage } from 'cloudinary-react-native';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn';
import { cld } from '@/lib/cloudinary';
import PostContent from './PostContent';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
type PostListItemProps = {
  post: any;
};

const PostListItem = ({ post }: PostListItemProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<any>(null);
  const [likeCount, setLikeCount] = useState<number>(0);
  const { user } = useAuth();
  useEffect(() => {
    if (post.my_likes?.length > 0) {
      setLikes(post.my_likes?.[0]);
      setIsLiked(true);
    }
  }, [post.my_likes]);
  useEffect(() => {
    if (isLiked) {
      saveLike();
    } else {
      deleteLike();
    }
  }, [isLiked]);

  const saveLike = async () => {
    if (likes) return;
    const { data } = await supabase
      .from('likes')
      .insert([{ user_id: user?.id, post_id: post.id }])
      .select();
    setLikes(data?.[0]);
  };
  const deleteLike = async () => {
    const { error } = await supabase.from('likes').delete().eq('id', likes?.id);
    if (!error) {
      setLikes(null);
    }
  };
  const avatar = cld.image(post.user.avatar_url ?? 'user_e8efbv');
  avatar.resize(
    thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face()))
  );
  return (
    <View className="bg-white">
      <View className="p-3 flex-row items-center gap-2">
        <AdvancedImage
          cldImg={avatar}
          className="w-12 aspect-square rounded-full"
        />
        <Text className="font-semibold">
          {post.user.username ?? 'New User'}
        </Text>
      </View>
      <PostContent post={post} />
      <View className="flex-row gap-3 p-3">
        <AntDesign
          name={isLiked ? 'heart' : 'hearto'}
          color={isLiked ? 'crimson' : 'black'}
          onPress={() => setIsLiked(!isLiked)}
          size={20}
        />
        <Ionicons name="chatbubble-outline" size={20} />
        <Feather name="send" size={20} />
        <Feather name="bookmark" size={20} className="ml-auto" />
      </View>

      <View className="px-3 ">
        <Text className="font-semibold">
          {post.likes?.[0]?.count || 0} likes
        </Text>
        <Text className="">
          <Text className="font-semibold">{post.user.username}</Text>{' '}
          {post.caption ?? 'No caption provided'}
        </Text>
      </View>
    </View>
  );
};

export default PostListItem;
