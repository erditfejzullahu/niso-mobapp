import { View, Text } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import EmptyState from '@/components/system/EmptyState'
import { useQuery } from '@tanstack/react-query'
import { paginationDto } from '@/utils/paginationDto'
import HeaderComponent from '@/components/HeaderComponent'
import { Conversations, ConversationsFilterInterface } from '@/types/app-types'
import api from '@/hooks/useApi'
import { RefreshControl } from 'react-native'
import LoadingState from '@/components/system/LoadingState'
import ErrorState from '@/components/system/ErrorState'
import ConversationItem from '@/components/ConversationItem'
import { useAuth } from '@/context/AuthContext'
import { Redirect } from 'expo-router'
import ConversationsFilter from '@/components/ConversationsFilter'

const ConversationsPage = () => {
    const {user} = useAuth();
    if(!user) return (<Redirect href={'/sign-in'}/>);
    const [pagination, setPagination] = useState({...paginationDto})

    const [conversationsFilter, setConversationsFilter] = useState<ConversationsFilterInterface>({
      filterBy: "all-conversations"
    })

    const {data, isLoading, error, isRefetching, refetch} = useQuery({
        queryKey: ['conversations', pagination],
        queryFn: async () => {
          const res = await api.get<Conversations[]>('/conversations/get-conversations-passenger', {params: pagination})
          return res.data;
        }
    })

    useEffect(() => {
      console.log(conversationsFilter, ' ????');
      
    }, [conversationsFilter])
    

    const headerComp = useMemo(() => (
      <View className='p-4'>
        <HeaderComponent 
            title={'Bisedat tua'}
            subtitle={"Ketu mund te nderveproni me te shoferet(biseda udhetimi apo per arsye te caktuara, kunder oferta etj,) dhe me mbeshtetjen teknike te Niso."}
        />
        <ConversationsFilter filters={conversationsFilter} setFilters={(newFilters) => setConversationsFilter(newFilters)}/>
      </View>
    ), [])

    const handleDeleteConversation = (id: string) => {

    }

    if(isLoading) return (<LoadingState />);
    if((!isLoading && !isRefetching) && error) return (<ErrorState message={`${error || "Dicka shkoi gabim ne marrjen e te dhenave te bisedave. Provoni perseri."}`} onRetry={refetch}/>)

  return (
    <View className='flex-1 bg-gray-50'>
        <KeyboardAwareFlatList 
            className='flex-1'
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={['#4f46e5']} // Indigo color for iOS
                tintColor="#4f46e5" // iOS spinner color
                progressBackgroundColor="#ffffff" // iOS background
              />
            }
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <ConversationItem item={item} user={user} onDelete={handleDeleteConversation} sheetSection={false}/>
            )}
            ListHeaderComponent={headerComp}
            ListEmptyComponent={() => (
              <View className='h-full mt-4'>
                <EmptyState message='Nuk u gjeten biseda aktuale. Nese mendoni qe eshte gabim, provoni perseri.' onRetry={refetch}/>
              </View>
            )}
        />
    </View>
  )
}

export default ConversationsPage