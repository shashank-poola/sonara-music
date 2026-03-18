import { Ionicons } from "@expo/vector-icons";

export type SettingRowProps = {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
    value?: string;
    toggle?: boolean;
    toggled?: boolean;
    onToggle?: (v: boolean) => void;
};

export const HOME_CATEGORIES = [
    { key: "all", label: "All" },
    { key: "songs", label: "Songs" },
    { key: "albums", label: "Album" },
    { key: "artists", label: "Artists" },
    { key: "playlists", label: "Playlists" },
] as const;