import { useRef, useState } from "react";
import { PanResponder, StyleSheet, View } from "react-native";
import { Colors } from "@/constants/theme";

interface SeekBarProps {
  position: number; // ms
  duration: number; // ms
  onSeek: (ms: number) => void;
  trackHeight?: number;
  thumbSize?: number;
  fillColor?: string;
  trackColor?: string;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function SeekBar({
  position,
  duration,
  onSeek,
  trackHeight = 4,
  thumbSize = 14,
  fillColor = Colors.button.primary,
  trackColor = Colors.player.progressInactive,
}: SeekBarProps) {
  const barWidthRef = useRef(0);
  const barPageXRef = useRef(0);
  const containerRef = useRef<View>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);

  const progress =
    duration > 0
      ? clamp((isDragging ? dragPosition : position) / duration, 0, 1)
      : 0;

  const getPositionFromPageX = (pageX: number) => {
    const pct = clamp(
      (pageX - barPageXRef.current) / barWidthRef.current,
      0,
      1
    );
    return pct * duration;
  };

  const measureContainer = () => {
    containerRef.current?.measure((_x, _y, width, _h, pageX) => {
      barWidthRef.current = width;
      barPageXRef.current = pageX;
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        measureContainer();
        setIsDragging(true);
        setDragPosition(getPositionFromPageX(e.nativeEvent.pageX));
      },
      onPanResponderMove: (e) => {
        setDragPosition(getPositionFromPageX(e.nativeEvent.pageX));
      },
      onPanResponderRelease: (e) => {
        setIsDragging(false);
        onSeek(getPositionFromPageX(e.nativeEvent.pageX));
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
      },
    })
  ).current;

  const containerHeight = Math.max(trackHeight, thumbSize) + 8;
  const verticalPad = (containerHeight - trackHeight) / 2;

  return (
    <View
      ref={containerRef}
      style={[styles.container, { height: containerHeight }]}
      onLayout={() => measureContainer()}
      {...panResponder.panHandlers}
    >
      {/* Track background */}
      <View
        style={[
          styles.track,
          { height: trackHeight, marginVertical: verticalPad, backgroundColor: trackColor },
        ]}
      >
        {/* Filled portion */}
        <View
          style={[
            styles.fill,
            {
              width: `${progress * 100}%`,
              height: trackHeight,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>

      {/* Thumb */}
      <View
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: fillColor,
            top: (containerHeight - thumbSize) / 2,
            left: `${progress * 100}%` as unknown as number,
            marginLeft: -thumbSize / 2,
            transform: [{ scale: isDragging ? 1.3 : 1 }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
  },
  track: {
    width: "100%",
    borderRadius: 99,
    overflow: "hidden",
  },
  fill: {
    borderRadius: 99,
  },
  thumb: {
    position: "absolute",
  },
});
