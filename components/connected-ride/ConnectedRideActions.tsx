import { ConnectedRideStatus } from '@/types/app-types';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    status: ConnectedRideStatus;
    role: 'DRIVER' | 'PASSENGER';
    notificationsCount: number;
    notificationsUnread: number;
    onOpenNotifications: () => void;
    onStartRide?: () => void;
    onCancelRide?: () => void;
    onLeaveReview?: () => void;
    canLeaveReview?: boolean;
    reviewLockedReason?: string;
    isStarting?: boolean;
    isCancelling?: boolean;
}

function ConnectedRideActions({
    status,
    role,
    notificationsCount,
    notificationsUnread,
    onOpenNotifications,
    onStartRide,
    onCancelRide,
    onLeaveReview,
    canLeaveReview,
    reviewLockedReason,
    isStarting,
    isCancelling,
}: Props) {
    const canStart = role === 'DRIVER' && status === ConnectedRideStatus.WAITING && !!onStartRide;
    const canCancel =
        (status === ConnectedRideStatus.WAITING || status === ConnectedRideStatus.DRIVING) && !!onCancelRide;

    return (
        <View style={styles.wrapper}>
            <Text style={styles.sectionLabel}>Veprime</Text>

            {/* Notifications button (always visible) */}
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85} onPress={onOpenNotifications}>
                <View style={[styles.actionIconWrap, { backgroundColor: '#eef2ff' }]}>
                    <Ionicons name="notifications" size={18} color="#4f46e5" />
                </View>
                <View style={styles.actionTextWrap}>
                    <Text style={styles.actionTitle}>Njoftimet e udhëtimit</Text>
                    <Text style={styles.actionSubtitle}>
                        {notificationsCount === 0 ? 'Asnjë njoftim' : `${notificationsCount} njoftime`}
                        {notificationsUnread > 0 ? ` · ${notificationsUnread} të palexuara` : ''}
                    </Text>
                </View>
                {notificationsCount > 0 && (
                    <View style={[styles.counterBadge, notificationsUnread > 0 && styles.counterBadgeUnread]}>
                        <Text style={[styles.counterBadgeText, notificationsUnread > 0 && styles.counterBadgeTextUnread]}>
                            {notificationsCount > 99 ? '99+' : notificationsCount}
                        </Text>
                    </View>
                )}
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>

            {/* Start ride (driver only, status WAITING) */}
            {canStart && (
                <TouchableOpacity
                    style={[styles.primaryBtn, isStarting && styles.btnDisabled]}
                    activeOpacity={0.85}
                    onPress={onStartRide}
                    disabled={isStarting}
                >
                    {isStarting ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name="play-circle" size={18} color="#fff" />
                    )}
                    <Text style={styles.primaryBtnText}>
                        {isStarting ? 'Duke nisur...' : 'Nisni udhëtimin'}
                    </Text>
                </TouchableOpacity>
            )}

            {/* Leave review (passenger only) */}
            {role === 'PASSENGER' && (
                <TouchableOpacity
                    style={[styles.actionBtn, !canLeaveReview && styles.actionBtnDisabled]}
                    activeOpacity={0.85}
                    onPress={canLeaveReview ? onLeaveReview : undefined}
                    disabled={!canLeaveReview}
                >
                    <View style={[styles.actionIconWrap, { backgroundColor: '#fef3c7' }]}>
                        <Ionicons name="star" size={18} color="#f59e0b" />
                    </View>
                    <View style={styles.actionTextWrap}>
                        <Text style={[styles.actionTitle, !canLeaveReview && styles.actionTitleDisabled]}>
                            {canLeaveReview ? 'Vlerësoni shoferin' : 'Vlerësimi i shoferit'}
                        </Text>
                        <Text style={styles.actionSubtitle}>
                            {canLeaveReview
                                ? 'Lini një vlerësim 1-5 për shoferin tuaj'
                                : reviewLockedReason || 'Nuk është i disponueshëm'}
                        </Text>
                    </View>
                    {canLeaveReview && <Ionicons name="chevron-forward" size={18} color="#9ca3af" />}
                </TouchableOpacity>
            )}

            {/* Cancel ride (both roles, when active) */}
            {canCancel && (
                <TouchableOpacity
                    style={[styles.dangerBtn, isCancelling && styles.btnDisabled]}
                    activeOpacity={0.85}
                    onPress={onCancelRide}
                    disabled={isCancelling}
                >
                    {isCancelling ? (
                        <ActivityIndicator size="small" color="#dc2626" />
                    ) : (
                        <Ionicons name="close-circle" size={18} color="#dc2626" />
                    )}
                    <Text style={styles.dangerBtnText}>
                        {isCancelling ? 'Duke anuluar...' : 'Anuloni udhëtimin'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

export default memo(ConnectedRideActions);

const styles = StyleSheet.create({
    wrapper: { gap: 8 },
    sectionLabel: {
        fontSize: 11,
        fontFamily: 'psemibold',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginLeft: 4,
        marginBottom: 2,
    },

    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    actionBtnDisabled: { opacity: 0.6 },
    actionIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionTextWrap: { flex: 1, gap: 2 },
    actionTitle: { fontSize: 14, fontFamily: 'pmedium', color: '#1e1b4b' },
    actionTitleDisabled: { color: '#6b7280' },
    actionSubtitle: { fontSize: 11, fontFamily: 'pregular', color: '#9ca3af' },

    counterBadge: {
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    counterBadgeUnread: { backgroundColor: '#dc2626' },
    counterBadgeText: { fontSize: 11, fontFamily: 'pmedium', color: '#374151' },
    counterBadgeTextUnread: { color: '#fff' },

    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#16a34a',
        paddingVertical: 13,
        borderRadius: 14,
        shadowColor: '#16a34a',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    primaryBtnText: { color: '#fff', fontSize: 14, fontFamily: 'psemibold' },

    dangerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fff',
        paddingVertical: 13,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#fecaca',
    },
    dangerBtnText: { color: '#dc2626', fontSize: 14, fontFamily: 'psemibold' },
    btnDisabled: { opacity: 0.6 },
});
