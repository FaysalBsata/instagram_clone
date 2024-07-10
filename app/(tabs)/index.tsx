import PostListItem from '@/Components/PostListItem';
import posts from '@/assets/data/posts.json';
import { FlatList } from 'react-native';
export default function FeedScreen() {
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
