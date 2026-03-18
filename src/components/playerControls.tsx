import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/theme";

type RepeatMode = "off" | "one" | "all";

type PlayerControlsProps = {
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

export function PlayerControls({
  isPlaying,
  isLoading,
  shuffleMode,
  repeatMode,
  onTogglePlay,
  onPrev,
  onNext,
  onShuffle,
  onRepeat,
}: PlayerControlsProps) {
  const repeatIcon =
    repeatMode === "one"
      ? "repeat-outline"
      : repeatMode === "all"
        ? "repeat"
        : "repeat";

  const repeatColor =
    repeatMode === "off" ? Colors.text.muted : Colors.button.primary;

  return (
    <View style={styles.controls}>
      <Pressable onPress={onShuffle} hitSlop={8}>
        <Ionicons
          name="shuffle"
          size={24}
          color={shuffleMode ? Colors.button.primary : Colors.text.muted}
        />
      </Pressable>

      <Pressable onPress={onPrev} hitSlop={8}>
        <Ionicons
          name="play-skip-back"
          size={32}
          color={Colors.text.primary}
        />
      </Pressable>

      <Pressable onPress={onTogglePlay} style={styles.playBtn}>
        <Ionicons
          name={isLoading ? "hourglass" : isPlaying ? "pause" : "play"}
          size={32}
          color={Colors.button.text}
        />
      </Pressable>

      <Pressable onPress={onNext} hitSlop={8}>
        <Ionicons
          name="play-skip-forward"
          size={32}
          color={Colors.text.primary}
        />
      </Pressable>

      <Pressable onPress={onRepeat} hitSlop={8}>
        <View>
          <Ionicons name={repeatIcon} size={24} color={repeatColor} />
          {repeatMode === "one" && (
            <View style={styles.repeatOneDot} />
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 24,
    paddingHorizontal: 8,
  },
  playBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.button.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  repeatOneDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.button.primary,
  },
});
