import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    title: string;
    subtitle?: string;
    onBack: () => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

function ConnectedRideHeader({ title, subtitle, onBack, onRefresh, isRefreshing }: Props) {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={22} color="#1e1b4b" />
            </TouchableOpacity>
            <View style={styles.titles}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
            </View>
            {onRefresh && (
                <TouchableOpacity style={[styles.iconBtn, styles.refreshBtn]} onPress={onRefresh} activeOpacity={0.7} disabled={isRefreshing}>
                    <Ionicons name="refresh" size={20} color={isRefreshing ? '#a5b4fc' : '#4f46e5'} />
                </TouchableOpacity>
            )}
        </View>
    );
}

export default memo(ConnectedRideHeader);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        gap: 12,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    refreshBtn: { backgroundColor: '#eef2ff' },
    titles: { flex: 1 },
    title: { fontSize: 17, fontFamily: 'psemibold', color: '#1e1b4b' },
    subtitle: { fontSize: 12, fontFamily: 'pregular', color: '#9ca3af', marginTop: 1 },
});
