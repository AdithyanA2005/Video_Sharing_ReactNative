import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/search-input";
import EmptyState from "../../components/empty-state";
import { searchBookmarkedPosts, searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/appwrite/use-appwrite";
import VideoCard from "../../components/video-card";
import { useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "../../context/global-provider";

export default function Search() {
  const { user } = useGlobalContext();
  const { query, scope } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() =>
    scope === "bookmarks" ? searchBookmarkedPosts(query, user.$id) : searchPosts(query),
  );

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">Search results</Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found" subtitle="No videos found for this search query" />
        )}
      />
    </SafeAreaView>
  );
}
