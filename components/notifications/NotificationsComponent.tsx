import api from '@/hooks/useApi';
import { useToggleNotifications } from '@/store/useToggleNotifications';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { memo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import LoadingState from '@/components/system/LoadingState';
import ErrorState from '@/components/system/ErrorState';
import EmptyState from '@/components/system/EmptyState';
import type { Notification } from '@/types/app-types';
import NotificationItem from '@/components/notifications/NotificationItem';
import Toast from '@/utils/appToast';
import { useAuth } from '@/context/AuthContext';

function NotificationsComponent() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const { isClosed, setToggled } = useToggleNotifications();

    if (!user) return null;

    if (isClosed) {
        bottomSheetRef.current?.dismiss();
    } else {
        bottomSheetRef.current?.present();
    }

    const { data, error, isLoading, isRefetching, refetch } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const [getNotifications] = await Promise.all([
                api.get<Notification[]>('/notifications/get-notifications'),
                api.patch('/notifications/read-notifications'),
            ]);
            return getNotifications;
        },
        refetchOnWindowFocus: false,
        enabled: !isClosed,
    });

    const deleteNotification = useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/notifications/delete-notification/${id}`);
        },
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['notifications'] });
            const previousNotifications = queryClient.getQueryData(['notifications']);

            queryClient.setQueryData(['notifications'], (old: any) => {
                return {
                    ...old,
                    data: old.data.filter((n: Notification) => n.id !== id),
                };
            });

            return { previousNotifications };
        },
        onError: (err: any, id, context) => {
            queryClient.setQueryData(['notifications'], context?.previousNotifications);
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
                <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
                    {isLoading || isRefetching ? (
                        <LoadingState />
                    ) : !isLoading && !isRefetching && error ? (
                        <ErrorState onRetry={refetch} />
                    ) : !data || data.data.length === 0 ? (
                        <EmptyState
                            onRetry={refetch}
                            message="Nuk u gjeten njoftime. Nese mendoni qe eshte gabim klikoni me poshte."
                            textStyle="!font-plight !text-sm"
                        />
                    ) : (
                        <View className="w-full gap-2.5">
                            {data.data.map((item) => (
                                <NotificationItem
                                    key={item.id}
                                    item={item}
                                    onDelete={(id) => deleteNotification.mutate(id)}
                                    user={user}
                                />
                            ))}
                        </View>
                    )}
                </BottomSheetScrollView>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
}

export default memo(NotificationsComponent);

const styles = StyleSheet.create({
    bottomSheet: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 5,
        shadowRadius: 4,
        elevation: 5,
    },
    bottomSheetContent: {
        flex: 1,
        paddingBottom: 60,
        paddingTop: 8,
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderTopColor: 'rgba(0,0,0,0.05)',
        borderTopWidth: 1,
    },
});

