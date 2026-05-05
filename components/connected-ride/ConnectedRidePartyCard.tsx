import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    role: 'driver' | 'passenger';
    fullName: string;
    image: string;
    onOpenChat?: () => void;
    chatDisabled?: boolean;
    chatDisabledReason?: string;
}

function ConnectedRidePartyCard({ role, fullName, image, onOpenChat, chatDisabled, chatDisabledReason }: Props) {
    const roleLabel = role === 'driver' ? 'Shoferi juaj' : 'Pasagjeri juaj';
    const subRoleLabel = role === 'driver' ? 'Shofer' : 'Pasagjer';

    return (
        <View style={styles.card}>
            <Text style={styles.cardLabel}>{roleLabel}</Text>
            <View style={styles.row}>
                <Image source={{ uri: image }} style={styles.avatar} />
                <View style={styles.infoWrapper}>
                    <Text style={styles.name} numberOfLines={1}>{fullName}</Text>
                    <View style={styles.subRoleRow}>
                        <Ionicons name={role === 'driver' ? 'car' : 'person'} size={12} color="#6b7280" />
                        <Text style={styles.subRoleText}>{subRoleLabel}</Text>
                    </View>
                </View>
                {onOpenChat && (
                    <TouchableOpacity
                        style={[styles.chatBtn, chatDisabled && styles.chatBtnDisabled]}
                        onPress={onOpenChat}
                        disabled={chatDisabled}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="chatbubbles" size={16} color={chatDisabled ? '#a1a1aa' : '#fff'} />
                        <Text style={[styles.chatBtnText, chatDisabled && styles.chatBtnTextDisabled]}>Chat</Text>
                    </TouchableOpacity>
                )}
            </View>
            {chatDisabled && chatDisabledReason && (
                <Text style={styles.chatDisabledHint}>{chatDisabledReason}</Text>
            )}
        </View>
    );
}

export default memo(ConnectedRidePartyCard);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        gap: 10,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    cardLabel: {
        fontSize: 11,
        fontFamily: 'psemibold',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f3f4f6',
    },
    infoWrapper: { flex: 1 },
    name: { fontSize: 15, fontFamily: 'psemibold', color: '#1e1b4b' },
    subRoleRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    subRoleText: { fontSize: 12, fontFamily: 'pregular', color: '#6b7280' },
    chatBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#4f46e5',
    },
    chatBtnDisabled: { backgroundColor: '#e5e7eb' },
    chatBtnText: { color: '#fff', fontSize: 12, fontFamily: 'pmedium' },
    chatBtnTextDisabled: { color: '#a1a1aa' },
    chatDisabledHint: {
        fontSize: 11,
        fontFamily: 'pregular',
        color: '#9ca3af',
    },
});
