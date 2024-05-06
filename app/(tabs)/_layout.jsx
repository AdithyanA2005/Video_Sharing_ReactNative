import { Image, Text, View } from "react-native";
import { Tabs } from "expo-router";
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="1bg-red-300 items-center justify-center gap-2">
      <Image source={icon} resizeMode="contain" tintColor={color} className="h-6 w-6" />
      <Text
        style={{ color: color }}
        className={`text-xs capitalize w-full ${focused ? "font-psemibold" : "font-pregular"}`}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabsLayout() {
  const screens = [
    { name: "Home", icon: icons.home },
    { name: "Bookmark", icon: icons.bookmark },
    { name: "Create", icon: icons.plus },
    { name: "Profile", icon: icons.profile },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            paddingVertical: 10,
            height: 80,
          },
        }}
      >
        {screens.map((screen) => (
          <Tabs.Screen
            key={screen.name}
            name={screen.name.toLowerCase()}
            options={{
              title: screen.name,
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon icon={screen.icon} color={color} name={screen.name} focused={focused} />
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
}
