import { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/search-input";
import EmptyState from "../../components/empty-state";
import { getBookmarkedPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/appwrite/use-appwrite";
import VideoCard from "../../components/video-card";
import { useGlobalContext } from "../../context/global-provider";

export default function Bookmark() {
  const { user } = useGlobalContext();
  const { data: posts, refetch, isLoading } = useAppwrite(() => getBookmarkedPosts(user.$id));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <Text className="text-2xl font-psemibold text-white">Saved Videos</Text>
            </View>

            <SearchInput />
          </View>
        )}
        ListEmptyComponent={() => (
          <View>
            <EmptyState
              title="No videos found"
              subtitle="Be the first one to upload a video"
              isLoading={isLoading}
            />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}
