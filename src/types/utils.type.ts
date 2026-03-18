import { Ionicons } from "@expo/vector-icons";

export type SettingRowProps = {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
    value?: string;
    toggle?: boolean;
    toggled?: boolean;
    onToggle?: (v: boolean) => void;
};