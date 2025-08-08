import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

type AnimatedHamburgerProps = {
  toggled?: boolean; // controlled state (optional)
  onToggle?: (next: boolean) => void; // now accepts next boolean
  size?: number;
  barWidth?: number;
  barHeight?: number;
  gap?: number;
  color?: string;
  duration?: number;
};

export default function AnimatedHamburger({
  toggled: controlledToggled = undefined,
  onToggle = () => {},
  size = 28,
  barWidth = 22,
  barHeight = 2.5,
  gap = 2,
  color = "#fff",
  duration = 200,
}: AnimatedHamburgerProps) {
  const internal = useSharedValue(0); // 0 = closed, 1 = open

  React.useEffect(() => {
    if (controlledToggled === undefined) return;
    internal.value = withTiming(controlledToggled ? 1 : 0, { duration });
  }, [controlledToggled, duration]);

  const toggle = () => {
    if (controlledToggled !== undefined) {
      onToggle(!controlledToggled);
      return;
    }
    const next = internal.value ? 0 : 1;
    internal.value = withTiming(next, { duration });
    onToggle(next === 1);
  };

  const topStyle = useAnimatedStyle(() => {
    const r = interpolate(internal.value, [0, 1], [0, 45]);
    const ty = interpolate(internal.value, [0, 1], [-(gap + barHeight), 0]);
    return { transform: [{ translateY: ty }, { rotate: `${r}deg` }] };
  });

  const middleStyle = useAnimatedStyle(() => {
    const o = interpolate(internal.value, [0, 1], [1, 0]);
    const sx = interpolate(internal.value, [0, 1], [1, 0.6]);
    return { opacity: o, transform: [{ scaleX: sx }] };
  });

  const bottomStyle = useAnimatedStyle(() => {
    const r = interpolate(internal.value, [0, 1], [0, -45]);
    const ty = interpolate(internal.value, [0, 1], [gap + barHeight, 0]);
    return { transform: [{ translateY: ty }, { rotate: `${r}deg` }] };
  });

  return (
    <TouchableWithoutFeedback onPress={toggle}>
      <View
        style={[
          styles.container,
          { width: size, height: size, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Animated.View
          style={[
            styles.bar,
            { width: barWidth, height: barHeight, backgroundColor: color, marginBottom: gap },
            topStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.bar,
            { width: barWidth, height: barHeight, backgroundColor: color },
            middleStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.bar,
            { width: barWidth, height: barHeight, backgroundColor: color, marginTop: gap },
            bottomStyle,
          ]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { padding: 6 },
  bar: { borderRadius: 2 },
});
