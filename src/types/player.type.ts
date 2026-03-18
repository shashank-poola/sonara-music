export type PlayerHeaderProps = {
    albumName?: string;
    onBack: () => void;
    onMore?: () => void;
};

export type Tab = "player" | "queue";