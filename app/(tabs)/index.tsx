// import posts from '@/assets/data/posts.json';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import PostListItem from '../Components/PostListItem';
export default function FeedScreen() {
  const [posts, setPosts] = useState<any[] | null>([]);
  useEffect(() => {
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    let { data, error } = await supabase
      .from('posts')
      .select('*, user:profiles(*)');
    console.log('🚀 ~ fetchPosts ~ data:', data);
    if (error) {
      Alert.alert(error.message);
    }
    setPosts(data);
  };
  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostListItem post={item} />}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
    />
  );
}
