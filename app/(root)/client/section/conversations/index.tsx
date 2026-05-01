import { View, Text, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import EmptyState from '@/components/system/EmptyState';
import { useInfiniteQuery } from '@tanstack/react-query';
import HeaderComponent from '@/components/HeaderComponent';
import { Conversations, ConversationsFilterInterface } from '@/types/app-types';
import api from '@/hooks/useApi';
import LoadingState from '@/components/system/LoadingState';
import ErrorState from '@/components/system/ErrorState';
import ConversationItem from '@/components/conversations/ConversationItem';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import ConversationsFilter from '@/components/ConversationsFilter';

const PAGE_SIZE = 20;

type ConversationsPage = { data: Conversations[]; hasMore: boolean };

const ConversationsPage = () => {
    const { user } = useAuth();
    if (!user) return <Redirect href={'/sign-in'} />;

    const [conversationsFilter, setConversationsFilter] =
        React.useState<ConversationsFilterInterface>({
            filterBy: 'all-conversations',
        });

    const {
        data,
        isLoading,
        error,
        isRefetching,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['conversations', 'list', 'passenger'],
        initialPageParam: undefined as string | undefined,
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams();
            params.set('limit', String(PAGE_SIZE));
            if (pageParam) params.set('cursor', pageParam);
            const res = await api.get<ConversationsPage>(
                `/conversations/get-conversations-passenger?${params.toString()}`
            );
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

    const handleDeleteConversation = (_id: string) => {};

    const headerComp = useMemo(
        () => (
            <View className="p-4">
                <HeaderComponent
                    title={'Bisedat tua'}
                    subtitle={
                        'Ketu mund te nderveproni me te shoferet(biseda udhetimi apo per arsye te caktuara, kunder oferta etj,) dhe me mbeshtetjen teknike te Niso.'
                    }
                />
                <ConversationsFilter
                    filters={conversationsFilter}
                    setFilters={(newFilters) => setConversationsFilter(newFilters)}
                />
            </View>
        ),
        [conversationsFilter]
    );

    const listFooter =
        isFetchingNextPage && hasNextPage ? (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#4f46e5" />
            </View>
        ) : null;

    if (isLoading && flatData.length === 0) return <LoadingState />;
    if (error && flatData.length === 0)
        return (
            <ErrorState
                message={`${error || 'Dicka shkoi gabim ne marrjen e te dhenave te bisedave. Provoni perseri.'}`}
                onRetry={() => void refetch()}
            />
        );

    return (
        <View className="flex-1 bg-gray-50">
            <KeyboardAwareFlatList
                className="flex-1"
                data={flatData}
                keyExtractor={(item) => item.id}
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
                ListHeaderComponent={headerComp}
                ListFooterComponent={listFooter}
                renderItem={({ item }) => (
                    <ConversationItem
                        item={item}
                        user={user}
                        onDelete={handleDeleteConversation}
                        sheetSection={false}
                    />
                )}
                ListEmptyComponent={() => (
                    <View className="h-full mt-4">
                        <EmptyState
                            message="Nuk u gjeten biseda aktuale. Nese mendoni qe eshte gabim, provoni perseri."
                            onRetry={() => void refetch()}
                        />
                    </View>
                )}
            />
        </View>
    );
};

export default ConversationsPage;
