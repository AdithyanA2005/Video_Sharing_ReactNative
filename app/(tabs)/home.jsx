import { useState, useEffect } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/search-input";
import Trending from "../../components/trending";
import EmptyState from "../../components/empty-state";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/appwrite/use-appwrite";
import VideoCard from "../../components/video-card";
import { useGlobalContext } from "../../context/global-provider";
import Spinner from "../../components/spinner";

export default function Home() {
  const { data: latestPosts, isLoading: isLatestPostsLoading } = useAppwrite(getLatestPosts);
  const { data: posts, refetch, isLoading: isPostsLoading } = useAppwrite(getAllPosts);
  const { user } = useGlobalContext();
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
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
                <Text className="text-2xl font-psemibold text-white">{user?.username}</Text>
              </View>

              <View className="mt-1.5">
                <Image source={images.logoSmall} className="w-9 h-10" resizeMode="contain" />
              </View>
            </View>

            <SearchInput />

            {latestPosts.length !== 0 && !isLatestPostsLoading ? (
              <View className="w-full flex-1 pt-5 pb-8">
                <Text className="mb-3 font-pregular text-sm text-gray-100">Latest Videos</Text>
                <Trending posts={latestPosts} />
              </View>
            ) : null}
          </View>
        )}
        ListEmptyComponent={() => (
          <View>
            <EmptyState
              title="No videos found"
              subtitle="Be the first one to upload a video"
              isLoading={isPostsLoading || isLatestPostsLoading}
            />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}
