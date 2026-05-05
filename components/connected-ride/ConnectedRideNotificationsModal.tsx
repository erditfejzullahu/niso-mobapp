import EmptyState from '@/components/system/EmptyState';
import ErrorState from '@/components/system/ErrorState';
import LoadingState from '@/components/system/LoadingState';
import { NotificationItem } from '@/components/notifications';
import { useRideNotifications } from '@/hooks/connected-ride/useRideNotifications';
import api from '@/hooks/useApi';
import type { Notification, User } from '@/types/app-types';
import Toast from '@/utils/appToast';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback, useMemo } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    visible: boolean;
    onClose: () => void;
    user: User;
    connectedRideId: string;
    rideRequestId: string | undefined;
    totalCount: number;
    unreadCount: number;
}

function ConnectedRideNotificationsModal({
    visible,
    onClose,
    user,
    connectedRideId,
    rideRequestId,
    totalCount,
    unreadCount,
}: Props) {
    const {
        data,
        isLoading,
        isRefetching,
        error,
        refetch,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useRideNotifications({ connectedRideId, rideRequestId }, visible);

    const flat = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            await api.delete(`/notifications/delete-notification/${id}`);
            await refetch();
            Toast.show({ type: 'success', text1: 'Njoftimi u fshi' });
        } catch (e: any) {
            Toast.show({
                type: 'error',
                text1: 'Gabim',
                text2: e?.response?.data?.message || 'Nuk u fshi njoftimi.',
            });
        }
    }, [refetch]);

    const renderItem = useCallback(
        ({ item }: { item: Notification }) => <NotificationItem item={item} onDelete={handleDelete} user={user} />,
        [handleDelete, user],
    );

    const keyExtractor = useCallback((item: Notification) => item.id, []);

    const ListFooter = useMemo(() => {
        if (isFetchingNextPage) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator size="small" color="#4f46e5" />
                </View>
            );
        }
        if (!hasNextPage && flat.length > 0) {
            return <Text style={styles.footerEnd}>Nuk ka më njoftime</Text>;
        }
        return null;
    }, [isFetchingNextPage, hasNextPage, flat.length]);

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconBtn} onPress={onClose} activeOpacity={0.7}>
                        <Ionicons name="chevron-back" size={22} color="#1e1b4b" />
                    </TouchableOpacity>
                    <View style={styles.titles}>
                        <Text style={styles.title}>Njoftimet e udhëtimit</Text>
                        <Text style={styles.subtitle}>
                            {totalCount === 0
                                ? 'Asnjë njoftim për këtë udhëtim'
                                : `${totalCount} gjithsej${unreadCount > 0 ? ` · ${unreadCount} të palexuara` : ''}`}
                        </Text>
                    </View>
                    <TouchableOpacity style={[styles.iconBtn, styles.refreshBtn]} onPress={() => refetch()} activeOpacity={0.7}>
                        <Ionicons name="refresh" size={20} color="#4f46e5" />
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <LoadingState message="Duke ngarkuar njoftimet..." />
                ) : error ? (
                    <ErrorState onRetry={() => refetch()} retryButtonText="Provoni përsëri" />
                ) : flat.length === 0 ? (
                    <EmptyState
                        icon="notifications-outline"
                        message="Nuk ka njoftime për këtë udhëtim ende."
                        onRetry={() => refetch()}
                        retryButtonText="Rifërko"
                    />
                ) : (
                    <FlatList
                        data={flat}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        onEndReached={() => {
                            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                        }}
                        onEndReachedThreshold={0.4}
                        ListFooterComponent={ListFooter}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefetching && !isFetchingNextPage}
                                onRefresh={() => refetch()}
                                colors={['#4f46e5']}
                                tintColor="#4f46e5"
                            />
                        }
                    />
                )}
            </SafeAreaView>
        </Modal>
    );
}

export default memo(ConnectedRideNotificationsModal);

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f9fafb' },
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
    title: { fontSize: 16, fontFamily: 'psemibold', color: '#1e1b4b' },
    subtitle: { fontSize: 12, fontFamily: 'pregular', color: '#9ca3af', marginTop: 1 },

    listContent: { paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
    footer: { paddingVertical: 16, alignItems: 'center' },
    footerEnd: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'pregular',
        color: '#d1d5db',
        paddingVertical: 16,
    },
});
