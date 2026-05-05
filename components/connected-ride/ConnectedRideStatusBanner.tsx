import { ConnectedRideStatus } from '@/types/app-types';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { memo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

dayjs.extend(relativeTime);

interface Props {
    status: ConnectedRideStatus;
    createdAt: string;
}

const STATUS_VISUAL: Record<ConnectedRideStatus, { label: string; bg: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
    [ConnectedRideStatus.WAITING]:               { label: 'Duke pritur', bg: '#fef3c7', color: '#d97706', icon: 'time' },
    [ConnectedRideStatus.DRIVING]:               { label: 'Në rrugë', bg: '#dcfce7', color: '#16a34a', icon: 'car-sport' },
    [ConnectedRideStatus.COMPLETED]:             { label: 'Përfunduar', bg: '#e0e7ff', color: '#4f46e5', icon: 'checkmark-circle' },
    [ConnectedRideStatus.CANCELLED_BY_DRIVER]:   { label: 'Anuluar nga shoferi', bg: '#fee2e2', color: '#dc2626', icon: 'close-circle' },
    [ConnectedRideStatus.CANCELLED_BY_PASSENGER]:{ label: 'Anuluar nga pasagjeri', bg: '#fee2e2', color: '#dc2626', icon: 'close-circle' },
};

function ConnectedRideStatusBanner({ status, createdAt }: Props) {
    const isActive = status === ConnectedRideStatus.WAITING || status === ConnectedRideStatus.DRIVING;
    const visual = STATUS_VISUAL[status];

    const pulse = useSharedValue(0);
    useEffect(() => {
        if (isActive) {
            pulse.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
        } else {
            pulse.value = 0;
        }
    }, [isActive, pulse]);

    const dotStyle = useAnimatedStyle(() => ({
        transform: [{ scale: 0.8 + pulse.value * 0.6 }],
        opacity: 0.5 + pulse.value * 0.5,
    }));

    return (
        <View style={styles.container}>
            <View style={[styles.badge, { backgroundColor: visual.bg }]}>
                <Ionicons name={visual.icon} size={16} color={visual.color} />
                <Text style={[styles.label, { color: visual.color }]}>{visual.label}</Text>
                {isActive && (
                    <Animated.View style={[styles.pulseDot, { backgroundColor: visual.color }, dotStyle]} />
                )}
            </View>
            <Text style={styles.timeText}>Krijuar {dayjs(createdAt).fromNow()}</Text>
        </View>
    );
}

export default memo(ConnectedRideStatusBanner);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    label: { fontSize: 13, fontFamily: 'pmedium' },
    pulseDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 4 },
    timeText: { fontSize: 12, fontFamily: 'pregular', color: '#9ca3af' },
});
