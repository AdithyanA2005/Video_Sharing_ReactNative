import { Text, View } from "react-native";

export default function InfoBox({ title, subtitle, containerClasses, titleClasses }) {
  return (
    <View className={containerClasses}>
      <Text className={`text-white text-center font-psemibold ${titleClasses}`}>{title}</Text>
      {subtitle && (
        <Text className="text-sm text-gray-100 text-center font-pregular">{subtitle}</Text>
      )}
    </View>
  );
}
