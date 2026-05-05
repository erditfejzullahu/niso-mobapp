import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    fromAddress: string;
    toAddress: string;
    price: string;
    distanceKm: string;
    isUrgent: boolean;
    onViewRideRequest?: () => void;
}

function ConnectedRideRouteCard({ fromAddress, toAddress, price, distanceKm, isUrgent, onViewRideRequest }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.label}>Detajet e udhëtimit</Text>
                {isUrgent && (
                    <View style={styles.urgentPill}>
                        <Ionicons name="flash" size={11} color="#b45309" />
                        <Text style={styles.urgentText}>Urgjent</Text>
                    </View>
                )}
            </View>

            <View style={styles.routeBlock}>
                <View style={styles.routeRow}>
                    <View style={[styles.routeDot, { backgroundColor: '#4f46e5' }]} />
                    <View style={styles.routeTextWrap}>
                        <Text style={styles.routeAddrLabel}>NGA</Text>
                        <Text style={styles.routeAddr} numberOfLines={2}>{fromAddress}</Text>
                    </View>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routeRow}>
                    <View style={[styles.routeDot, { backgroundColor: '#dc2626' }]} />
                    <View style={styles.routeTextWrap}>
                        <Text style={styles.routeAddrLabel}>DERI</Text>
                        <Text style={styles.routeAddr} numberOfLines={2}>{toAddress}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Ionicons name="cash" size={14} color="#4f46e5" />
                    <Text style={styles.statValue}>{price} €</Text>
                    <Text style={styles.statLabel}>Çmimi</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <Ionicons name="speedometer" size={14} color="#4f46e5" />
                    <Text style={styles.statValue}>{distanceKm}</Text>
                    <Text style={styles.statLabel}>km</Text>
                </View>
            </View>

            {onViewRideRequest && (
                <TouchableOpacity style={styles.viewBtn} onPress={onViewRideRequest} activeOpacity={0.85}>
                    <Ionicons name="document-text" size={15} color="#4f46e5" />
                    <Text style={styles.viewBtnText}>Hap kërkesën e udhëtimit</Text>
                    <Ionicons name="chevron-forward" size={15} color="#4f46e5" />
                </TouchableOpacity>
            )}
        </View>
    );
}

export default memo(ConnectedRideRouteCard);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    label: {
        fontSize: 11,
        fontFamily: 'psemibold',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    urgentPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#fef3c7',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    urgentText: { fontSize: 10, fontFamily: 'pmedium', color: '#b45309' },

    routeBlock: { gap: 4 },
    routeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    routeDot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
    routeLine: { width: 1.5, height: 12, backgroundColor: '#d1d5db', marginLeft: 4 },
    routeTextWrap: { flex: 1 },
    routeAddrLabel: { fontSize: 10, fontFamily: 'pmedium', color: '#9ca3af', letterSpacing: 0.5 },
    routeAddr: { fontSize: 14, fontFamily: 'pmedium', color: '#1f2937', marginTop: 1 },

    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        paddingVertical: 10,
    },
    statBox: { flex: 1, alignItems: 'center', gap: 2 },
    statValue: { fontSize: 15, fontFamily: 'psemibold', color: '#1e1b4b' },
    statLabel: { fontSize: 10, fontFamily: 'pregular', color: '#9ca3af' },
    statDivider: { width: 1, height: 28, backgroundColor: '#e5e7eb' },

    viewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#eef2ff',
    },
    viewBtnText: { fontSize: 13, fontFamily: 'pmedium', color: '#4f46e5' },
});
