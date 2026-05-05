import api from '@/hooks/useApi';
import { useToggleNotifications } from '@/store/useToggleNotifications';
import {
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import type { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import LoadingState from '@/components/system/LoadingState';
import ErrorState from '@/components/system/ErrorState';
import EmptyState from '@/components/system/EmptyState';
import type { Notification } from '@/types/app-types';
import NotificationItem from '@/components/notifications/NotificationItem';
import Toast from '@/utils/appToast';
import { useAuth } from '@/context/AuthContext';

const PAGE_SIZE = 20;

type NotificationsPage = { data: Notification[]; hasMore: boolean };

function NotificationsComponent() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const { isClosed, setToggled } = useToggleNotifications();

    useEffect(() => {
        if (!user) return;
        if (isClosed) bottomSheetRef.current?.dismiss();
        else bottomSheetRef.current?.present();
    }, [isClosed, user]);

    const {
        data,
        error,
        isLoading,
        isRefetching,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['notifications'],
        initialPageParam: undefined as string | undefined,
        refetchOnWindowFocus: false,
        enabled: !!user && !isClosed,
        queryFn: async ({ pageParam }) => {
            if (!user) return { data: [] as Notification[], hasMore: false };
            const params = new URLSearchParams();
            params.set('limit', String(PAGE_SIZE));
            if (pageParam) params.set('cursor', pageParam);

            if (!pageParam) {
                const [getRes] = await Promise.allSettled([
                    api.get<NotificationsPage>(`/notifications/get-notifications?${params.toString()}`),
                    api.patch('/notifications/read-notifications'),
                ]);
                if (getRes.status !== 'fulfilled') {
                    return { data: [] as Notification[], hasMore: false };
                }
                return getRes.value.data;
            }

            const res = await api.get<NotificationsPage>(
                `/notifications/get-notifications?${params.toString()}`
            );
            return res.data;
        },
        getNextPageParam: (lastPage) =>
            lastPage.hasMore && lastPage.data.length > 0
                ? lastPage.data[lastPage.data.length - 1]!.id
                : undefined,
    });

    const flatData = useMemo(
        () => data?.pages.flatMap((p) => p.data) ?? [],
        [data]
    );

    console.log(flatData);

    const onEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const deleteNotification = useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/notifications/delete-notification/${id}`);
        },
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['notifications'] });
            const previous = queryClient.getQueryData<InfiniteData<NotificationsPage>>([
                'notifications',
            ]);

            queryClient.setQueryData<InfiniteData<NotificationsPage>>(
                ['notifications'],
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            data: page.data.filter((n) => n.id !== id),
                        })),
                    };
                }
            );

            return { previous };
        },
        onError: (err: any, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['notifications'], context.previous);
            }
            Toast.show({
                type: 'error',
                text1: 'Gabim!',
                text2: err.response?.data?.message || 'Dicka shkoi gabim ne fshirjen e njoftimit.',
            });
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Sukses!',
                text2: 'Njoftimi u fshi me sukses.',
            });
        },
    });

    if (!user) return null;

    const showInitialLoad = isLoading && flatData.length === 0;

    const listFooter =
        isFetchingNextPage && hasNextPage ? (
            <View className="py-4 items-center justify-center">
                <ActivityIndicator size="small" color="#4f46e5" />
            </View>
        ) : null;

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={bottomSheetRef}
                index={0}
                snapPoints={['50%', '80%']}
                enableDynamicSizing={false}
                enablePanDownToClose
                style={styles.bottomSheet}
                onChange={(idx) => idx === -1 && setToggled(true)}
                backdropComponent={({ style }) => (
                    <View style={[style, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onTouchEnd={() => setToggled(true)} />
                )}
            >
                {showInitialLoad ? (
                    <View className="w-full flex-1 pt-2 pb-16 items-center bg-gray-50">
                        <LoadingState />
                    </View>
                ) : error && flatData.length === 0 ? (
                    <View className="w-full flex-1 pt-2 pb-16 items-center bg-gray-50">
                        <ErrorState onRetry={() => void refetch()} />
                    </View>
                ) : flatData.length === 0 ? (
                    <View className="w-full flex-1 pt-2 pb-16 items-center bg-gray-50">
                        <EmptyState
                            onRetry={() => void refetch()}
                            message="Nuk u gjeten njoftime. Nese mendoni qe eshte gabim klikoni me poshte."
                            textStyle="!font-plight !text-sm"
                        />
                    </View>
                ) : (
                    <BottomSheetFlatList
                        data={flatData}
                        keyExtractor={(item: Notification) => item.id}
                        renderItem={({ item }: ListRenderItemInfo<Notification>) => (
                            <NotificationItem
                                item={item}
                                onDelete={(id) => deleteNotification.mutate(id)}
                                user={user}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.25}
                        ListFooterComponent={listFooter}
                        refreshing={isRefetching && !isFetchingNextPage}
                        onRefresh={() => void refetch()}
                    />
                )}
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
}

export default NotificationsComponent;

const styles = StyleSheet.create({
    bottomSheet: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 5,
        shadowRadius: 4,
        elevation: 5,
    },
    listContent: {
        paddingBottom: 60,
        paddingTop: 8,
        // paddingHorizontal: 16,
        backgroundColor: '#f9fafb',
        borderTopColor: 'rgba(0,0,0,0.05)',
        borderTopWidth: 1,
        gap: 10,
    },
});
