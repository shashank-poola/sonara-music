import { SaavnSongSearchResult } from "./saavn.type";
import { UserPlaylist } from "@/store/playlists-store";

export type AddToPlaylistButtonProps = {
    currentSong: SaavnSongSearchResult;
    onPress: () => void;
};

export type AddToPlaylistSheetProps = {
    visible: boolean;
    currentSong: SaavnSongSearchResult | null;
    playlists: UserPlaylist[];
    onClose: () => void;
    onAddToPlaylist: (playlistId: string) => void;
    onCreatePlaylist: () => void;
};

export type CreatePlaylistModalProps = {
    visible: boolean;
    value: string;
    onChangeText: (text: string) => void;
    onClose: () => void;
    onCreate: () => void;
};
  
export type PlaylistsEmptyStateProps = {
    onCreatePress: () => void;
};

export type PlaylistsHeaderProps = {
    onAddPress: () => void;
};

export type PlaylistsRowProps = {
    playlist: UserPlaylist;
    onDelete: () => void;
};