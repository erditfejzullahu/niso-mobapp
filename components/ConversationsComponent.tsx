import {
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ListRenderItemInfo,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useToggleMessagesSheet } from '@/store/useToggleMessagesSheet';
import LoadingState from './system/LoadingState';
import ErrorState from './system/ErrorState';
import EmptyState from './system/EmptyState';
import api from '@/hooks/useApi';
import { AxiosError } from 'axios';
import { Conversations, Role } from '@/types/app-types';
import { MessageSquareLock, RefreshCcw } from 'lucide-react-native';
import ConversationItem from './conversations/ConversationItem';
import { useRouter } from 'expo-router';
import { getUserRole } from '@/utils/usefulFunctions';
import Toast from '@/utils/appToast';

const PAGE_SIZE = 20;

type ConversationsPage = { data: Conversations[]; hasMore: boolean };

const ConversationsComponent = () => {
    const { user } = useAuth();
    const userRole = user ? getUserRole(user) : null;

    const router = useRouter();

    const queryClient = useQueryClient();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const { isClosed, setToggled } = useToggleMessagesSheet();

    useEffect(() => {
        if (!user) return;
        if (isClosed) bottomSheetRef.current?.dismiss();
        else bottomSheetRef.current?.present();
    }, [isClosed, user]);

    const listEndpoint =
        userRole === Role.PASSENGER
            ? '/conversations/get-conversations-passenger'
            : '/conversations/get-active-conversations-driver';

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
        queryKey: ['conversations', 'sheet', userRole ?? 'none'],
        initialPageParam: undefined as string | undefined,
        refetchOnWindowFocus: false,
        enabled: !!userRole && !isClosed,
        queryFn: async ({ pageParam }) => {
            if (!userRole) return { data: [] as Conversations[], hasMore: false };
            const params = new URLSearchParams();
            params.set('limit', String(PAGE_SIZE));
            if (pageParam) params.set('cursor', pageParam);
            const res = await api.get<ConversationsPage>(`${listEndpoint}?${params.toString()}`);
            return res.data;
        },
        getNextPageParam: (lastPage) =>
            lastPage.hasMore && lastPage.data.length > 0
                ? lastPage.data[lastPage.data.length - 1]!.id
                : undefined,
    });

    const flatData = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

    const onEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleDeleteConversation = async (id: string) => {
        try {
            await api.delete(`/conversations/delete-conversation/${id}`);
            queryClient.removeQueries({ queryKey: ['conversation-item', id] });
            await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        } catch (error) {
            console.error(error);
            const message =
                error instanceof AxiosError && typeof error.response?.data?.message === 'string'
                    ? error.response.data.message
                    : 'Nuk u fshi biseda. Provoni perseri.';
            Toast.show({
                type: 'error',
                text1: 'Gabim!',
                text2: message,
            });
        }
    };

    const handleRouteToConversations = useCallback(() => {
        if (user?.role === 'PASSENGER') {
            setToggled(true);
            router.replace('/client/section/conversations');
        }
    }, [user?.role, router, setToggled]);

    const listHeader = useMemo(
        () => (
            <View className="w-full gap-3 pb-3 flex-row justify-center">
                <TouchableOpacity
                    onPress={handleRouteToConversations}
                    className="bg-gray-50 flex-row items-center mx-auto gap-2 shadow-lg shadow-black/10 px-2 py-1.5 border-gray-200 border rounded-lg"
                >
                    <Text className="font-pregular text-sm text-indigo-600">
                        Drejtohuni tek bisedat
                    </Text>
                    <MessageSquareLock color={'#4f46e5'} size={18} />
                </TouchableOpacity>
                <View className="flex-row justify-end absolute right-3">
                    <TouchableOpacity
                        onPress={() => void refetch()}
                        className="bg-gray-50 shadow-lg shadow-black/10 px-2 py-1.5 rounded-lg border border-gray-200"
                    >
                        <RefreshCcw color={'#4f46e5'} size={18} />
                    </TouchableOpacity>
                </View>
            </View>
        ),
        [refetch, handleRouteToConversations]
    );

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
                enablePanDownToClose={true}
                style={styles.bottomSheet}
                onChange={(idx) => idx === -1 && setToggled(true)}
                backdropComponent={({ style }) => (
                    <View
                        style={[style, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                        onTouchEnd={() => setToggled(true)}
                    />
                )}
            >
                {showInitialLoad ? (
                    <View className="w-full flex-1 pt-2 pb-16 px-4 items-center bg-gray-50">
                        <LoadingState />
                    </View>
                ) : error && flatData.length === 0 ? (
                    <View className="w-full flex-1 pt-2 pb-16 px-4 items-center bg-gray-50">
                        <ErrorState onRetry={() => void refetch()} />
                    </View>
                ) : flatData.length === 0 ? (
                    <View className="w-full flex-1 pt-2 pb-16 px-4 items-center bg-gray-50">
                        <EmptyState
                            onRetry={() => void refetch()}
                            message="Nuk u gjeten biseda. Nëse mendoni që është gabim, provoni përsëri."
                            textStyle="!font-plight !text-sm"
                        />
                    </View>
                ) : (
                    <BottomSheetFlatList
                        data={flatData}
                        keyExtractor={(item: Conversations) => item.id}
                        ListHeaderComponent={listHeader}
                        renderItem={({ item }: ListRenderItemInfo<Conversations>) => (
                            <ConversationItem
                                sheetSection={true}
                                user={user}
                                item={item}
                                onDelete={(id) => void handleDeleteConversation(id)}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefetching && !isFetchingNextPage}
                                onRefresh={() => void refetch()}
                                colors={['#4f46e5']}
                                tintColor="#4f46e5"
                                progressBackgroundColor="#ffffff"
                            />
                        }
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.25}
                        ListFooterComponent={listFooter}
                    />
                )}
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
};

export default ConversationsComponent;

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
        flex: 1
    },
});
