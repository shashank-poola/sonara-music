import { Feather, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MiniPlayer, TAB_BAR_HEIGHT } from "@/components/mini-player";
import { Colors } from "@/constants/theme";

type TabName = "home" | "search" | "playlists" | "settings";

type TabConfig = { name: TabName; title: string };

const TABS: TabConfig[] = [
  { name: "home", title: "Home" },
  { name: "search", title: "Search" },
  { name: "playlists", title: "Playlists" },
  { name: "settings", title: "Settings" },
];

function TabIcon({
  focused,
  name,
  size,
}: {
  focused: boolean;
  name: TabName;
  size: number;
}) {
  const iconSize = Math.max(18, Math.floor(size * 0.92));
  const iconColor = "#000000";

  return (
    <View
      style={{
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {name === "home" ? (
        <Octicons name={focused ? "home-fill" : "home"} size={iconSize} color={iconColor} />
      ) : name === "search" ? (
        <Ionicons name="search" size={iconSize} color={iconColor} />
      ) : name === "playlists" ? (
        <MaterialIcons name="my-library-music" size={iconSize} color={iconColor} />
      ) : (
        <Feather name="settings" size={iconSize} color={iconColor} />
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }} edges={["bottom"]}>
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#000000",
              borderTopColor: Colors.border.primary,
              borderTopWidth: 1,
              height: TAB_BAR_HEIGHT,
              paddingBottom: 10,
              paddingTop: 8,
            },
            tabBarActiveTintColor: "#FFFFFF",
            tabBarInactiveTintColor: Colors.text.muted,
            tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
          }}
        >
          {TABS.map((tab) => (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                title: tab.title,
                tabBarIcon: ({ size, focused }) => (
                  <TabIcon name={tab.name} size={size} focused={focused} />
                ),
              }}
            />
          ))}
        </Tabs>

        <MiniPlayer />
      </View>
    </SafeAreaView>
  );
}
