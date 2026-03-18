import { Ionicons } from "@expo/vector-icons";

export type SettingsRowProps = {
    icon: React.ReactNode;
    label: string;
    value?: string;
    toggle?: boolean;
    toggled?: boolean;
    onToggle?: (v: boolean) => void;
    onPress?: () => void;
  };

export const HOME_CATEGORIES = [
    { key: "all", label: "All" },
    { key: "songs", label: "Songs" },
    { key: "albums", label: "Album" },
    { key: "artists", label: "Artists" },
    { key: "playlists", label: "Playlists" },
] as const;

export interface SeekBarProps {
    position: number; // ms
    duration: number; // ms
    onSeek: (ms: number) => void;
    trackHeight?: number;
    thumbSize?: number;
    fillColor?: string;
    trackColor?: string;
}

export type AlbumDetailScreenProps = {
    albumId: string;
};
