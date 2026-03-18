export type Tab = "player" | "queue";
import { SaavnSongSearchResult } from "./saavn.type";

export type PlayerAlbumArtProps = {
    imageUri: string | undefined;
};

export type PlayerHeaderProps = {
    albumName?: string;
    onBack: () => void;
    onMore?: () => void;
};

export type RepeatMode = "off" | "one" | "all";

export type PlayerControlsProps = {
  isPlaying: boolean;
  isLoading: boolean;
  shuffleMode: boolean;
  repeatMode: RepeatMode;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
};

export type PlayerEmptyStateProps = {
    onBack: () => void;
};

export type PlayerExtraRowProps = {
    currentSong: SaavnSongSearchResult | null;
    onShowQueue: () => void;
};

export type PlayerQueueListProps = {
    queue: SaavnSongSearchResult[];
    currentIndex: number;
    onSelectSong: (index: number, song: SaavnSongSearchResult) => void;
};

export type PlayerSongInfoProps = {
    title: string;
    artist: string;
    onAddToPlaylist?: () => void;
};

export type PlayerTabSwitcherProps = {
    activeTab: Tab;
    queueCount: number;
    onTabChange: (tab: Tab) => void;
};
  
  