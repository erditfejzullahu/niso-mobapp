import { View, Text, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
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

const ConversationsComponent = () => {
    const {user} = useAuth();
    const userRole = user ? getUserRole(user) : null;

    const router = useRouter();

    const queryClient = useQueryClient();
    const bottomSheetRef = useRef<BottomSheetModal>(null)

    const {isClosed, setToggled} = useToggleMessagesSheet();

    useEffect(() => {
        if (!user) return;
        if (isClosed) bottomSheetRef.current?.dismiss();
        else bottomSheetRef.current?.present();
    }, [isClosed, user]);

    const {data, error, isLoading, isRefetching, refetch} = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            if (!userRole) return [] as Conversations[];
            const res = await api.get<Conversations[]>(
                userRole === Role.PASSENGER
                    ? '/conversations/get-conversations-passenger'
                    : '/conversations/get-active-conversations-driver'
            )
            return res.data;
        },
        refetchOnWindowFocus: false,
        enabled: !!userRole && !isClosed
    })

    const handleDeleteConversation = async (id: string) => {
        try {
            await api.delete(`/conversations/delete-conversation/${id}`);
            queryClient.removeQueries({ queryKey: ['conversation-item', id] });
            await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        } catch (error) {
            console.error(error);
            const message =
                error instanceof AxiosError &&
                typeof error.response?.data?.message === 'string'
                    ? error.response.data.message
                    : 'Nuk u fshi biseda. Provoni perseri.';
            Toast.show({
                type: 'error',
                text1: 'Gabim!',
                text2: message,
            });
        }
    }

    const handleRouteToConversations = () => {
        if(user?.role === "PASSENGER"){
            setToggled(true)
            router.replace('/client/section/conversations');
        }
    }

    if(!user) return null;

  return (
    <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={0} // Start expanded
          snapPoints={["50%", '80%']}
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
            <>
            <BottomSheetView style={{flex: 1, minHeight: "100%"}}>
                <BottomSheetScrollView
                    contentContainerStyle={styles.bottomSheetContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={() => refetch()}
                            colors={['#4f46e5']}
                            tintColor="#4f46e5"
                            progressBackgroundColor="#ffffff"
                        />
                    }
                >
                    <TouchableOpacity onPress={() => refetch()} className='absolute right-2 top-2 bg-gray-50 shadow-lg shadow-black/10 px-2 py-1.5 rounded-lg border border-gray-200'>
                        <RefreshCcw color={"#4f46e5"} size={18}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRouteToConversations} className='bg-gray-50 mb-3 flex-row items-center gap-2 shadow-lg shadow-black/10 px-2 py-1.5 border-gray-200 border rounded-lg'>
                        <Text className='font-pregular text-sm text-indigo-600'>Drejtohuni tek bisedat</Text>
                        <MessageSquareLock color={"#4f46e5"} size={18}/>
                    </TouchableOpacity>
                    
                  {isLoading ? (
                    <LoadingState />
                  ) : error ? (
                    <ErrorState onRetry={refetch}/>
                  ) : !data || data.length === 0 ? (
                    <EmptyState onRetry={refetch} message="Nuk u gjeten njoftime. Nese mendoni qe eshte gabim klikoni me poshte." textStyle="!font-plight !text-sm" />
                  ) : (
                    <View className="w-full gap-2.5">
                    {data.map((item) => (
                        <ConversationItem sheetSection={true} key={item.id} user={user} item={item} onDelete={(id) => handleDeleteConversation(id)}/>
                    ))}
                    </View>
                  )}
                </BottomSheetScrollView>
            </BottomSheetView>
            </>
        </BottomSheetModal>
        </BottomSheetModalProvider>
  )
}

export default ConversationsComponent


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
    // padding: 16,
    paddingBottom: 60,
    paddingTop: 8,
    // paddingInline: 8,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderTopColor: "rgba(0,0,0,0.05)",
    borderTopWidth: 1,
  },
})