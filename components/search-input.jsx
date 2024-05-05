import { useState } from "react";
import { router } from "expo-router";
import { Alert, Image, TextInput, TouchableOpacity, View } from "react-native";
import { icons } from "../constants";
import { usePathname } from "expo-router";

export default function SearchInput({ initialQuery, isBookmarksOnly }) {
  const { pathname } = usePathname();
  const [query, setQuery] = useState(initialQuery || "");
  const scope = isBookmarksOnly ? "bookmarks" : "";

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder={isBookmarksOnly ? "Search saved videos" : "Search a video topic"}
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) return Alert.alert("Missing Query", "Please enter a search query");
          if (pathname === `/search/`) router.setParams({ query, scope });
          else router.push(`/search/${query}?scope=${scope}`);
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}
