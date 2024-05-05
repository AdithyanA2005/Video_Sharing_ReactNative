import { Image, Text, View } from "react-native";
import { images } from "../constants";
import CustomButton from "./custom-button";
import { router } from "expo-router";
import Spinner from "./spinner";

export default function EmptyState({ title, subtitle, isLoading }) {
  if (isLoading) {
    return (
      <View className="mt-16">
        <Spinner size={45} />
      </View>
    );
  }

  return (
    <View className="justify-center items-center px-4">
      <Image source={images.empty} className="w-[270px] h-[215px]" resizeMode="contain" />
      <Text className="font-pmedium text-sm text-gray-100">{title}</Text>
      <Text className="text-xl font-psemibold text-white text-center mt-2">{subtitle}</Text>
      <CustomButton
        title="Create Video"
        onPress={() => router.push("/create")}
        containerClassNames="w-full my-5"
      />
    </View>
  );
}
