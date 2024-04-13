import { Text, TouchableOpacity } from "react-native";

export default function CustomButton({
  title,
  onPress,
  containerClassNames,
  textClassNames,
  isLoading,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerClassNames} ${isLoading ? "opacity-50" : ""}`}
    >
      <Text className={`text-primary font-psemibold text-lg ${textClassNames}`}>{title}</Text>
    </TouchableOpacity>
  );
}
