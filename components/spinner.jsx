import { ActivityIndicator, View } from "react-native";

export default function Spinner({otherClassNames}) {
  return (
    <View className="min-h-[62px]">
      <ActivityIndicator size="large" color="#FF9C01" className={otherClassNames} />
    </View>
  )
}