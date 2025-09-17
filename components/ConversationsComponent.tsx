import { View, Text, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useToggleMessagesSheet } from '@/store/useToggleMessagesSheet';
import { StyleSheet } from 'react-native';
import LoadingState from './system/LoadingState';
import ErrorState from './system/ErrorState';
import EmptyState from './system/EmptyState';
import api from '@/hooks/useApi';
import { Conversations } from '@/types/app-types';
import { MessageSquareLock, RefreshCcw } from 'lucide-react-native';
import ConversationItem from './ConversationItem';

const ConversationsComponent = () => {
    const {user} = useAuth();
    if(!user) return null;

    const queryClient = useQueryClient();
    const bottomSheetRef = useRef<BottomSheetModal>(null)

    const {isClosed, setToggled} = useToggleMessagesSheet();

    if(isClosed){
        bottomSheetRef.current?.dismiss();
    }else{
        bottomSheetRef.current?.present();
    }

    const {data, error, isLoading, isRefetching, refetch} = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const res = await api.get<Conversations[]>('/conversations/get-conversations-passenger')
            return res.data;
        },
        refetchOnWindowFocus: false,
        enabled: !isClosed
    })

    const handleDeleteConversation = (id: string) => {
        try {
            
        } catch (error) {
            
        }
    }

    console.log(data);
    

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
                <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
                    <TouchableOpacity onPress={() => refetch()} className='absolute right-2 top-2 bg-gray-50 shadow-lg shadow-black/10 px-2 py-1.5 rounded-lg border border-gray-200'>
                        <RefreshCcw color={"#4f46e5"} size={18}/>
                    </TouchableOpacity>
                    <TouchableOpacity className='bg-gray-50 mb-3 flex-row items-center gap-2 shadow-lg shadow-black/10 px-2 py-1.5 border-gray-200 border rounded-lg'>
                        <Text className='font-pregular text-sm text-indigo-600'>Te gjithe bisedat</Text>
                        <MessageSquareLock color={"#4f46e5"} size={18}/>
                    </TouchableOpacity>
                    
                  {isLoading || isRefetching ? (
                    <LoadingState />
                  ) : ((!isLoading && !isRefetching) && error ? (
                    <ErrorState onRetry={refetch}/>
                  ) : !data || data.length === 0 ? (
                    <EmptyState onRetry={refetch} message="Nuk u gjeten njoftime. Nese mendoni qe eshte gabim klikoni me poshte." textStyle="!font-plight !text-sm" />
                  ) : (
                    <View className="w-full gap-2.5">
                    {data.map((item) => (
                        <ConversationItem key={item.id} user={user} item={item} onDelete={(id) => handleDeleteConversation(id)}/>
                    ))}
                    </View>
                  ))}
                </BottomSheetScrollView>
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