import { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { bookmarkVideo, unBookmarkVideo } from "../lib/appwrite";
import { useGlobalContext } from "../context/global-provider";

export default function VideoCard({ video: { creator, ...video } }) {
  const { user } = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const usersWhoBookmarkedVideo = video.bookmarkedBy;
    return usersWhoBookmarkedVideo.some((bookmarkedUser) => bookmarkedUser.$id === user.$id);
  });

  const handleBookmark = async () => {
    setIsBookmarked((prev) => !prev);
    try {
      if (isBookmarked) await unBookmarkVideo(user.$id, video.$id);
      else await bookmarkVideo(user.$id, video.$id);
    } catch (error) {
      setIsBookmarked((prev) => !prev);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: creator.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
              {video.title}
            </Text>
            <Text className="text-gray-100 font-pregular text-xs" numberOfLines={1}>
              {creator.username}
            </Text>
          </View>
        </View>

        <View className="pt-3">
          <TouchableOpacity onPress={handleBookmark}>
            <Image
              source={icons.bookmark}
              tintColor={isBookmarked ? "#FFA001" : null}
              className="w-4 h-5"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video.video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls={true}
          shouldPlay={true}
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) setPlay(false);
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: video.thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
}
