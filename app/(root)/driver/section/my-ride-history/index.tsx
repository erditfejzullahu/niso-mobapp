import ErrorState from '@/components/system/ErrorState';
import LoadingState from '@/components/system/LoadingState';
import EmptyState from '@/components/system/EmptyState';
import { useDriverRideHistory } from '@/hooks/driver-rides/useDriverRideHistory';
import { useDriverConnectedRideHistory } from '@/hooks/driver-rides/useDriverConnectedRideHistory';
import {
    ConnectedRideStatus,
    DriverConnectedRideHistoryItem,
    DriverRideHistoryItem,
    RideRequestStatus,
} from '@/types/app-types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight, FadeInLeft } from 'react-native-reanimated';

dayjs.extend(relativeTime);

type Tab = 'requests' | 'rides';

// ─── Active helpers ───────────────────────────────────────────────────────────

function isActiveRequest(item: DriverRideHistoryItem): boolean {
    return (
        item.status === RideRequestStatus.WAITING ||
        item.connectedRide?.status === ConnectedRideStatus.DRIVING ||
        item.connectedRide?.status === ConnectedRideStatus.WAITING
    );
}

function isActiveConnectedRide(item: DriverConnectedRideHistoryItem): boolean {
    return item.status === ConnectedRideStatus.WAITING || item.status === ConnectedRideStatus.DRIVING;
}

// ─── Status labels ────────────────────────────────────────────────────────────

function getRequestStatusInfo(item: DriverRideHistoryItem): { label: string; color: string; bg: string } {
    if (item.connectedRide?.status === ConnectedRideStatus.DRIVING)
        return { label: 'Në rrugë', color: '#16a34a', bg: '#dcfce7' };
    if (item.connectedRide?.status === ConnectedRideStatus.WAITING)
        return { label: 'Pritur konfirmim', color: '#d97706', bg: '#fef3c7' };
    if (item.status === RideRequestStatus.WAITING)
        return { label: 'Në pritje', color: '#4f46e5', bg: '#eef2ff' };
    if (item.status === RideRequestStatus.COMPLETED || item.connectedRide?.status === ConnectedRideStatus.COMPLETED)
        return { label: 'Përfunduar', color: '#6b7280', bg: '#f3f4f6' };
    if (
        item.status === RideRequestStatus.CANCELLED ||
        item.connectedRide?.status === ConnectedRideStatus.CANCELLED_BY_DRIVER ||
        item.connectedRide?.status === ConnectedRideStatus.CANCELLED_BY_PASSENGER
    )
        return { label: 'Anuluar', color: '#dc2626', bg: '#fee2e2' };
    return { label: item.status, color: '#6b7280', bg: '#f3f4f6' };
}

function getConnectedRideStatusInfo(status: ConnectedRideStatus): { label: string; color: string; bg: string } {
    switch (status) {
        case ConnectedRideStatus.DRIVING:               return { label: 'Në rrugë', color: '#16a34a', bg: '#dcfce7' };
        case ConnectedRideStatus.WAITING:               return { label: 'Duke pritur', color: '#d97706', bg: '#fef3c7' };
        case ConnectedRideStatus.COMPLETED:             return { label: 'Përfunduar', color: '#6b7280', bg: '#f3f4f6' };
        case ConnectedRideStatus.CANCELLED_BY_DRIVER:   return { label: 'Anuluar prej jush', color: '#dc2626', bg: '#fee2e2' };
        case ConnectedRideStatus.CANCELLED_BY_PASSENGER: return { label: 'Anuluar nga pasagjeri', color: '#dc2626', bg: '#fee2e2' };
        default: return { label: status, color: '#6b7280', bg: '#f3f4f6' };
    }
}

// ─── Shared card chrome ───────────────────────────────────────────────────────

const CardShell = React.memo(function CardShell({
    active,
    statusBg,
    statusColor,
    statusLabel,
    isUrgent,
    createdAt,
    fromAddress,
    toAddress,
    personName,
    price,
    distanceKm,
    onPress,
    index,
}: {
    active: boolean;
    statusBg: string;
    statusColor: string;
    statusLabel: string;
    isUrgent: boolean;
    createdAt: string;
    fromAddress: string;
    toAddress: string;
    personName: string | null;
    price: string;
    distanceKm: string;
    onPress: () => void;
    index: number;
}) {
    return (
        <Animated.View entering={FadeInDown.delay(Math.min(index * 55, 400)).duration(340)}>
            <TouchableOpacity
                activeOpacity={0.82}
                style={[styles.card, active && styles.activeCard]}
                onPress={onPress}
            >
                {active && <View style={styles.activeDot} />}

                <View style={styles.cardHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        {isUrgent && (
                            <View style={styles.urgentBadge}>
                                <Ionicons name="flash" size={10} color="#b45309" />
                                <Text style={styles.urgentText}>Urgent</Text>
                            </View>
                        )}
                        <Text style={styles.dateText}>{dayjs(createdAt).fromNow()}</Text>
                    </View>
                </View>

                <View style={styles.routeContainer}>
                    <View style={styles.routeRow}>
                        <View style={[styles.routeDot, { backgroundColor: '#4f46e5' }]} />
                        <Text style={styles.addressText} numberOfLines={1}>{fromAddress}</Text>
                    </View>
                    <View style={styles.routeLine} />
                    <View style={styles.routeRow}>
                        <View style={[styles.routeDot, { backgroundColor: '#dc2626' }]} />
                        <Text style={styles.addressText} numberOfLines={1}>{toAddress}</Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.footerLeft}>
                        {personName ? (
                            <View style={styles.personRow}>
                                <MaterialIcons name="person" size={14} color="#6b7280" />
                                <Text style={styles.personText} numberOfLines={1}>{personName}</Text>
                            </View>
                        ) : (
                            <View style={styles.personRow}>
                                <MaterialIcons name="person-search" size={14} color="#9ca3af" />
                                <Text style={[styles.personText, { color: '#9ca3af' }]}>Pa pasagjer</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.footerRight}>
                        <Text style={styles.priceText}>{price} €</Text>
                        <Text style={styles.distanceText}>{distanceKm} km</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
});

// ─── Section label ────────────────────────────────────────────────────────────

const SectionLabel = React.memo(function SectionLabel({ label, count }: { label: string; count: number }) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{label}</Text>
            <View style={styles.sectionCount}>
                <Text style={styles.sectionCountText}>{count}</Text>
            </View>
        </View>
    );
});

// ─── List footer ──────────────────────────────────────────────────────────────

const ListFooter = React.memo(function ListFooter({
    isFetchingNextPage,
    hasNextPage,
}: {
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
}) {
    if (isFetchingNextPage) {
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#4f46e5" />
                <Text style={styles.footerText}>Duke ngarkuar më shumë...</Text>
            </View>
        );
    }
    if (!hasNextPage) {
        return (
            <View style={styles.footer}>
                <Text style={styles.footerEndText}>Nuk ka më rezultate</Text>
            </View>
        );
    }
    return null;
});

// ─── Tab switcher ─────────────────────────────────────────────────────────────

const TabSwitcher = React.memo(function TabSwitcher({
    activeTab,
    onSwitch,
    requestCount,
    rideCount,
}: {
    activeTab: Tab;
    onSwitch: (t: Tab) => void;
    requestCount: number | undefined;
    rideCount: number | undefined;
}) {
    return (
        <View style={styles.tabRow}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.tabBtn, activeTab === 'requests' && styles.tabBtnActive]}
                onPress={() => onSwitch('requests')}
            >
                <Ionicons name="document-text-outline" size={15} color={activeTab === 'requests' ? '#fff' : '#6b7280'} />
                <Text style={[styles.tabLabel, activeTab === 'requests' && styles.tabLabelActive]}>Kërkesat</Text>
                {requestCount !== undefined && (
                    <View style={[styles.tabBadge, activeTab === 'requests' && styles.tabBadgeActive]}>
                        <Text style={[styles.tabBadgeText, activeTab === 'requests' && styles.tabBadgeTextActive]}>
                            {requestCount}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.tabBtn, activeTab === 'rides' && styles.tabBtnActive]}
                onPress={() => onSwitch('rides')}
            >
                <Ionicons name="car-outline" size={15} color={activeTab === 'rides' ? '#fff' : '#6b7280'} />
                <Text style={[styles.tabLabel, activeTab === 'rides' && styles.tabLabelActive]}>Udhëtimet</Text>
                {rideCount !== undefined && (
                    <View style={[styles.tabBadge, activeTab === 'rides' && styles.tabBadgeActive]}>
                        <Text style={[styles.tabBadgeText, activeTab === 'rides' && styles.tabBadgeTextActive]}>
                            {rideCount}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
});

// ─── Mixed list item types ────────────────────────────────────────────────────

type SectionHeaderItem = { _type: 'section'; label: string; count: number };
type RequestListItem   = DriverRideHistoryItem | SectionHeaderItem;
type RideListItem      = DriverConnectedRideHistoryItem | SectionHeaderItem;

function isSectionHeader(item: RequestListItem | RideListItem): item is SectionHeaderItem {
    return '_type' in item && item._type === 'section';
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function DriverRideHistoryScreen() {
    const [activeTab, setActiveTab] = useState<Tab>('requests');

    const requestsQuery = useDriverRideHistory();
    const ridesQuery    = useDriverConnectedRideHistory();

    const allRequests = useMemo(
        () => requestsQuery.data?.pages.flatMap((p) => p.items) ?? [],
        [requestsQuery.data],
    );
    const allRides = useMemo(
        () => ridesQuery.data?.pages.flatMap((p) => p.items) ?? [],
        [ridesQuery.data],
    );

    const activeRequests  = useMemo(() => allRequests.filter(isActiveRequest), [allRequests]);
    const historyRequests = useMemo(() => allRequests.filter((r) => !isActiveRequest(r)), [allRequests]);
    const activeRides     = useMemo(() => allRides.filter(isActiveConnectedRide), [allRides]);
    const historyRides    = useMemo(() => allRides.filter((r) => !isActiveConnectedRide(r)), [allRides]);

    const requestListData = useMemo<RequestListItem[]>(() => {
        const out: RequestListItem[] = [];
        if (activeRequests.length > 0) {
            out.push({ _type: 'section', label: 'Aktive', count: activeRequests.length });
            out.push(...activeRequests);
        }
        if (historyRequests.length > 0) {
            out.push({ _type: 'section', label: 'Historiku', count: historyRequests.length });
            out.push(...historyRequests);
        }
        return out;
    }, [activeRequests, historyRequests]);

    const rideListData = useMemo<RideListItem[]>(() => {
        const out: RideListItem[] = [];
        if (activeRides.length > 0) {
            out.push({ _type: 'section', label: 'Aktive', count: activeRides.length });
            out.push(...activeRides);
        }
        if (historyRides.length > 0) {
            out.push({ _type: 'section', label: 'Historiku', count: historyRides.length });
            out.push(...historyRides);
        }
        return out;
    }, [activeRides, historyRides]);

    const renderRequestItem = useCallback(({ item, index }: { item: RequestListItem; index: number }) => {
        if (isSectionHeader(item)) return <SectionLabel label={item.label} count={item.count} />;
        const { label, color, bg } = getRequestStatusInfo(item);
        return (
            <CardShell
                index={index}
                active={isActiveRequest(item)}
                statusLabel={label}
                statusColor={color}
                statusBg={bg}
                isUrgent={item.isUrgent}
                createdAt={item.createdAt}
                fromAddress={item.fromAddress}
                toAddress={item.toAddress}
                personName={item.passenger?.fullName ?? null}
                price={item.price}
                distanceKm={item.distanceKm}
                onPress={() => {
                    if (item.connectedRide?.id) {
                        router.push(`/(root)/connected-ride/${item.connectedRide.id}` as any);
                    } else {
                        router.push(`/(root)/driver/section/active-routes/${item.id}` as any);
                    }
                }}
            />
        );
    }, []);

    const renderRideItem = useCallback(({ item, index }: { item: RideListItem; index: number }) => {
        if (isSectionHeader(item)) return <SectionLabel label={item.label} count={item.count} />;
        const { label, color, bg } = getConnectedRideStatusInfo(item.status);
        return (
            <CardShell
                index={index}
                active={isActiveConnectedRide(item)}
                statusLabel={label}
                statusColor={color}
                statusBg={bg}
                isUrgent={item.rideRequest.isUrgent}
                createdAt={item.createdAt}
                fromAddress={item.rideRequest.fromAddress}
                toAddress={item.rideRequest.toAddress}
                personName={item.passenger.fullName}
                price={item.rideRequest.price}
                distanceKm={item.rideRequest.distanceKm}
                onPress={() => router.push(`/(root)/connected-ride/${item.id}` as any)}
            />
        );
    }, []);

    const requestKeyExtractor = useCallback((item: RequestListItem, index: number) => {
        if (isSectionHeader(item)) return `req-sec-${item.label}-${index}`;
        return `req-${item.id}`;
    }, []);

    const rideKeyExtractor = useCallback((item: RideListItem, index: number) => {
        if (isSectionHeader(item)) return `ride-sec-${item.label}-${index}`;
        return `ride-${item.id}`;
    }, []);

    const handleTabSwitch = useCallback((t: Tab) => setActiveTab(t), []);

    const currentQuery = activeTab === 'requests' ? requestsQuery : ridesQuery;
    const isEmpty = activeTab === 'requests' ? allRequests.length === 0 : allRides.length === 0;

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View style={styles.header} className="mt-4">
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={22} color="#1e1b4b" />
                </TouchableOpacity>
                <View style={styles.headerTitles}>
                    <Text style={styles.headerTitle}>Udhëtimet e mia</Text>
                    <Text style={styles.headerSubtitle}>Kërkesat dhe udhëtimet ku keni marrë pjesë</Text>
                </View>
                <TouchableOpacity style={styles.refreshBtn} onPress={() => currentQuery.refetch()} activeOpacity={0.7}>
                    <Ionicons name="refresh" size={20} color="#4f46e5" />
                </TouchableOpacity>
            </View>

            {/* Tab switcher */}
            <TabSwitcher
                activeTab={activeTab}
                onSwitch={handleTabSwitch}
                requestCount={allRequests.length > 0 ? allRequests.length : undefined}
                rideCount={allRides.length > 0 ? allRides.length : undefined}
            />

            {/* Content */}
            {currentQuery.isLoading ? (
                <LoadingState message="Duke ngarkuar të dhënat..." />
            ) : currentQuery.error ? (
                <ErrorState
                    message="Nuk mund të ngarkohen të dhënat. Provoni përsëri."
                    onRetry={() => currentQuery.refetch()}
                    retryButtonText="Rifërko"
                />
            ) : isEmpty ? (
                <EmptyState
                    icon={activeTab === 'requests' ? 'document-outline' : 'car-outline'}
                    message={
                        activeTab === 'requests'
                            ? 'Nuk keni asnjë kërkesë udhëtimi të pranuar deri tani.'
                            : 'Nuk keni asnjë udhëtim të lidhur deri tani.'
                    }
                    onRetry={() => currentQuery.refetch()}
                    retryButtonText="Rifërko"
                />
            ) : activeTab === 'requests' ? (
                <Animated.View entering={FadeInLeft.duration(220)} style={{ flex: 1 }}>
                    <FlatList
                        data={requestListData}
                        keyExtractor={requestKeyExtractor}
                        renderItem={renderRequestItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        onEndReached={() => {
                            if (requestsQuery.hasNextPage && !requestsQuery.isFetchingNextPage) {
                                requestsQuery.fetchNextPage();
                            }
                        }}
                        onEndReachedThreshold={0.4}
                        ListFooterComponent={
                            <ListFooter
                                isFetchingNextPage={requestsQuery.isFetchingNextPage}
                                hasNextPage={!!requestsQuery.hasNextPage}
                            />
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={requestsQuery.isRefetching && !requestsQuery.isFetchingNextPage}
                                onRefresh={() => requestsQuery.refetch()}
                                colors={['#4f46e5']}
                                tintColor="#4f46e5"
                                progressBackgroundColor="#ffffff"
                            />
                        }
                    />
                </Animated.View>
            ) : (
                <Animated.View entering={FadeInRight.duration(220)} style={{ flex: 1 }}>
                    <FlatList
                        data={rideListData}
                        keyExtractor={rideKeyExtractor}
                        renderItem={renderRideItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        onEndReached={() => {
                            if (ridesQuery.hasNextPage && !ridesQuery.isFetchingNextPage) {
                                ridesQuery.fetchNextPage();
                            }
                        }}
                        onEndReachedThreshold={0.4}
                        ListFooterComponent={
                            <ListFooter
                                isFetchingNextPage={ridesQuery.isFetchingNextPage}
                                hasNextPage={!!ridesQuery.hasNextPage}
                            />
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={ridesQuery.isRefetching && !ridesQuery.isFetchingNextPage}
                                onRefresh={() => ridesQuery.refetch()}
                                colors={['#4f46e5']}
                                tintColor="#4f46e5"
                                progressBackgroundColor="#ffffff"
                            />
                        }
                    />
                </Animated.View>
            )}
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitles: { flex: 1 },
    headerTitle: { fontSize: 17, fontFamily: 'psemibold', color: '#1e1b4b' },
    headerSubtitle: { fontSize: 12, fontFamily: 'pregular', color: '#9ca3af', marginTop: 1 },
    refreshBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#eef2ff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    tabRow: {
        flexDirection: 'row',
        margin: 16,
        marginBottom: 4,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 4,
        gap: 4,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    tabBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 11,
    },
    tabBtnActive: { backgroundColor: '#4f46e5' },
    tabLabel: { fontSize: 13, fontFamily: 'pmedium', color: '#6b7280' },
    tabLabelActive: { color: '#fff' },
    tabBadge: {
        backgroundColor: '#e5e7eb',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 1,
        minWidth: 20,
        alignItems: 'center',
    },
    tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
    tabBadgeText: { fontSize: 11, fontFamily: 'pmedium', color: '#374151' },
    tabBadgeTextActive: { color: '#fff' },

    listContent: { padding: 16, paddingTop: 12, paddingBottom: 32, gap: 10 },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
        marginTop: 6,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'psemibold',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    sectionCount: {
        backgroundColor: '#e5e7eb',
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    sectionCountText: { fontSize: 11, fontFamily: 'pmedium', color: '#374151' },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 2,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    activeCard: {
        borderWidth: 1.5,
        borderColor: '#4f46e5',
        shadowColor: '#4f46e5',
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 6,
    },
    activeDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22c55e',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    statusBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
    statusText: { fontSize: 12, fontFamily: 'pmedium' },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    urgentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#fef3c7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    urgentText: { fontSize: 10, fontFamily: 'pmedium', color: '#b45309' },
    dateText: { fontSize: 12, fontFamily: 'pregular', color: '#9ca3af' },
    routeContainer: { gap: 4, marginBottom: 12 },
    routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    routeDot: { width: 8, height: 8, borderRadius: 4 },
    routeLine: { width: 1.5, height: 10, backgroundColor: '#d1d5db', marginLeft: 3 },
    addressText: { flex: 1, fontSize: 13, fontFamily: 'pmedium', color: '#1f2937' },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 10,
    },
    footerLeft: { flex: 1 },
    personRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    personText: { fontSize: 12, fontFamily: 'pregular', color: '#6b7280', flexShrink: 1 },
    footerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    priceText: { fontSize: 14, fontFamily: 'psemibold', color: '#4f46e5' },
    distanceText: { fontSize: 12, fontFamily: 'pregular', color: '#9ca3af' },

    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        marginBottom: 32,
    },
    footerText: { fontSize: 13, fontFamily: 'pregular', color: '#6b7280' },
    footerEndText: { fontSize: 12, fontFamily: 'pregular', color: '#d1d5db' },
});
