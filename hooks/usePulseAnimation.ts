import { useEffect } from "react";
import { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export function usePulseAnimation({
    minScale = 1, maxScale = 1.03, duration = 500, minOpacity = 0.7, maxOpacity = 1,
} : {minScale?: number; maxScale?: number; duration?: number; minOpacity?: number; maxOpacity?: number})
{
    const scale = useSharedValue(minScale);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
        scale.value,
        [minScale, maxScale],
        [minOpacity, maxOpacity]
        );

        return {
        transform: [{ scale: scale.value }],
        opacity,
        };
    });

    useEffect(() => {
        scale.value = withRepeat(
        withTiming(maxScale, { duration }),
        -1, // infinite
        true // reverse
        );
    }, []);

    return animatedStyle;
}