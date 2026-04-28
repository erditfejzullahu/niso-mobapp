import { useAppToastStore } from "@/store/useAppToastStore";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SLIDE_IN_FROM = -96;
const SLIDE_OUT_TO = -120;
const SWIPE_DISMISS_Y = -56;
const SWIPE_VELOCITY = -650;
const TAP_MOVE_MAX = 14;

/**
 * Custom toast with spring open, timing close, and swipe-up to dismiss.
 */
export function AppToastHost() {
  const insets = useSafeAreaInsets();
  const visible = useAppToastStore((s) => s.visible);
  const exiting = useAppToastStore((s) => s.exiting);
  const toastType = useAppToastStore((s) => s.toastType);
  const text1 = useAppToastStore((s) => s.text1);
  const text2 = useAppToastStore((s) => s.text2);
  const toastOnPress = useAppToastStore((s) => s.toastOnPress);
  const hide = useAppToastStore((s) => s.hide);
  const finishDismiss = useAppToastStore((s) => s.finishDismiss);

  const translateY = useSharedValue(SLIDE_IN_FROM);
  const opacity = useSharedValue(0);
  const panStartY = useSharedValue(0);

  const shouldShow = visible || exiting;

  // Enter: slide down + fade in
  useEffect(() => {
    if (!visible || exiting) return;
    cancelAnimation(translateY);
    cancelAnimation(opacity);
    translateY.value = SLIDE_IN_FROM;
    opacity.value = 0;
    translateY.value = withSpring(0, { damping: 20, stiffness: 260, mass: 0.8 });
    opacity.value = withTiming(1, { duration: 320 });
  }, [visible, exiting, text1, text2, toastType, translateY, opacity]);

  // Exit: slide up + fade (timer, tap, or swipe handoff)
  useEffect(() => {
    if (!exiting) return;
    cancelAnimation(translateY);
    cancelAnimation(opacity);
    translateY.value = withTiming(
      SLIDE_OUT_TO,
      { duration: 280 },
      (finished) => {
        if (finished) runOnJS(finishDismiss)();
      }
    );
    opacity.value = withTiming(0, { duration: 240 });
  }, [exiting, finishDismiss, translateY, opacity]);

  const animatedCard = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const triggerHide = () => hide();
  const triggerFinishActions = () => {
    toastOnPress?.();
    hide();
  };

  const pan = Gesture.Pan()
    .enabled(!exiting)
    .failOffsetX([-32, 32])
    .onBegin(() => {
      panStartY.value = translateY.value;
      cancelAnimation(translateY);
    })
    .onUpdate((e) => {
      const next = Math.min(0, panStartY.value + e.translationY);
      translateY.value = next;
    })
    .onEnd((e) => {
      const movedUp = translateY.value < SWIPE_DISMISS_Y || e.velocityY < SWIPE_VELOCITY;
      const isTap =
        Math.abs(e.translationX) < TAP_MOVE_MAX &&
        Math.abs(e.translationY) < TAP_MOVE_MAX;

      if (movedUp) {
        runOnJS(triggerHide)();
        return;
      }
      if (isTap) {
        runOnJS(triggerFinishActions)();
        return;
      }
      translateY.value = withSpring(0, { damping: 18, stiffness: 280 });
    });

  if (!shouldShow) {
    return null;
  }

  const borderColor =
    toastType === "error" ? "#dc2626" : toastType === "info" ? "#0ea5e9" : "#4f46e5";

  return (
    <View
      style={[styles.layer, { paddingTop: insets.top + 8 }]}
      pointerEvents="box-none"
    >
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.card, { borderLeftColor: borderColor }, animatedCard]}
          accessibilityRole="alert"
        >
          {text1 ? (
            <Text style={styles.text1} numberOfLines={3}>
              {text1}
            </Text>
          ) : null}
          {text2 ? (
            <Text style={styles.text2} numberOfLines={6}>
              {text2}
            </Text>
          ) : null}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 999999,
    elevation: 999999,
    alignItems: "stretch",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderLeftWidth: 4,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  text1: {
    fontSize: 13,
    fontFamily: "psemibold",
    color: "#1e1b4b",
  },
  text2: {
    marginTop: 4,
    fontSize: 10,
    fontFamily: "plight",
    color: "#312e81",
  },
});
