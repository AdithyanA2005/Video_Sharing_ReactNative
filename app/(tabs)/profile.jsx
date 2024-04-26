import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/empty-state";
import { getUserPosts, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/appwrite/use-appwrite";
import VideoCard from "../../components/video-card";
import { useGlobalContext } from "../../context/global-provider";
import { Redirect, router } from "expo-router";
import { icons } from "../../constants";
import InfoBox from "../../components/info-box";

export default function Profile() {
  const { user, setUser, isLoading, isLogged, setIsLogged } = useGlobalContext();

  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity className="w-full items-end mb-10" onPress={logout}>
              <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                resizeMode="cover"
                className="w-[90%] h-[90%] rounded-lg"
              />
            </View>

            <InfoBox title={user?.username} containerClasses="mt-5" titleClasses="text-lg" />

            <View className="flex-row mt-5">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerClasses="mr-5"
                titleClasses="text-xl"
              />
              <InfoBox title="1.3k" subtitle="Followers" titleClasses="text-xl" />
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
