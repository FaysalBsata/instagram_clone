// import posts from '@/assets/data/posts.json';
import { supabase } from '@/lib/supabase';
import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, ViewabilityConfig, ViewToken } from 'react-native';
import PostListItem from '../Components/PostListItem';
import { useAuth } from '@/providers/AuthProvider';
export default function FeedScreen() {
  const [posts, setPosts] = useState<any[] | null>([]);
  const { user } = useAuth();
  useEffect(() => {
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    let { data, error } = await supabase
      .from('posts')
      .select('*, user:profiles(*), my_likes:likes(*), likes(count)')
      // .eq('user_id', user?.id)
      .eq('my_likes.user_id', user?.id)
      .order('created_at', { ascending: false });
    if (error) {
      Alert.alert(error.message);
    }
    setPosts(data);
  };
  const [visiblePostId, setVisiblePostId] = useState<number | null>(null);

  const viewabilityConfig = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const firstVisibleItem = viewableItems[0].item as any;
        setVisiblePostId(firstVisibleItem.id);
      }
    }
  ).current;
  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <PostListItem post={item} isVisible={item.id === visiblePostId} />
      )}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
}
