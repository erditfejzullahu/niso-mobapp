import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { MailCheck, MailSearch, MailX, Users } from 'lucide-react-native'
import { ConversationsFilterInterface } from '@/types/app-types'
import { Foundation } from '@expo/vector-icons'

const filterConversationsBy = [
    {label: "Te gjitha", value: "all-conversations", icon: <Foundation name="torsos-all" size={20} color="#1e1b4b" />},
    {label: "Biseda te casshme", value: "available-conversations", icon: <MailCheck size={20} color={"#1e1b4b"}/>},
    {label: "Kerko leje-bisede", value: "try-open-conversations", icon: <MailSearch size={20} color={"#1e1b4b"}/>},
    {label: "Biseda te mbyllura", value: "closed-conversations", icon: <MailX size={20} color={"#1e1b4b"}/>}
]


const ConversationsFilter = ({filters, setFilters}: {filters: ConversationsFilterInterface, setFilters: Dispatch<SetStateAction<ConversationsFilterInterface>>}) => {
    const [selectedFilter, setSelectedFilter] = useState<string>("Te gjitha");

    const handleFilterPress = (filterValue: ConversationsFilterInterface['filterBy']) => {
        setSelectedFilter(filterValue);
        // You can map the label to your actual filter properties here
        // For example:
        
        setFilters({filterBy: filterValue});
    };    

    const outputFiltersText = useMemo(() => {        
        return(
        <View className='bg-gray-100 border border-gray-200 shadow-md shadow-black/10 p-3 rounded-xl'>
        {selectedFilter === "all-conversations" ? (
            <>
                <View className='flex-row items-center gap-1'>
                    <Text className='text-lg font-psemibold text-indigo-950'>Te gjithe bisedat</Text>
                    <Foundation name="torsos-all" size={20} color="#4f46e5" />
                </View>
                <Text className='text-xs font-pregular text-gray-400'>Ketu shfaqen te gjithe bisedat qe jane te hapura dhe te mbyllura.</Text>
            </>
        ) : selectedFilter === "available-conversations" ? (
            <>
            <View className='flex-row items-center gap-1'>
                <Text className='text-lg font-psemibold text-indigo-950'>Bisedat e casshme</Text>
                <MailCheck size={20} color={"#4f46e5"}/>
            </View>
                <Text className='text-xs font-pregular text-gray-400'>Ketu shfaqen te gjithe bisedat qe jane te hapura dhe mund te komunikohet ende me personat ne fjale.</Text>
            </>
        ) : selectedFilter === "closed-conversations" ? (
            <>
            <View className='flex-row items-center gap-1'>
                <Text className='text-lg font-psemibold text-indigo-950'>Bisedat e mbyllura</Text>
                <MailX size={20} color={"#4f46e5"}/>
            </View>
                <Text className='text-xs font-pregular text-gray-400'>Ketu shfaqen te gjithe bisedat qe jane te mbyllura. Komunikimi me personat ne fjale eshte i pamundshem. Mund te dergoni kerkese per komunikim permes nderveprimeve ne klikim te personit ne fjale.</Text>
            </>
        ) : selectedFilter === "try-open-conversations" ? (
            <>
            <View className='flex-row items-center gap-1'>
                <Text className='text-lg font-psemibold text-indigo-950'>Kerko komunikim</Text>
                <MailSearch size={20} color={"#4f46e5"}/>
            </View>
                <Text className='text-xs font-pregular text-gray-400'>Ketu shfaqen te gjithe bisedat qe nuk keni pasur nderveprime me personat ne fjale. Mund te dergoni kerkese per komunikim permes nderveprimeve ne klikim te personit ne fjale.</Text>
            </>
        ) : null}
        </View>
        )
    }, [selectedFilter])

  return (
    <>
    <ScrollView showsHorizontalScrollIndicator={false} className='p-3 -ml-3' horizontal contentContainerStyle={{alignItems: "center", gap: 10}}>
        {filterConversationsBy.map((item, idx) => (
            <TouchableOpacity activeOpacity={1} onPress={() => handleFilterPress(item.value as ConversationsFilterInterface['filterBy'])} key={idx} className={`flex-row gap-1 items-center ${selectedFilter === item.value ? "bg-white" : "bg-gray-50"} rounded-xl px-4 py-0.5 shadow-md shadow-black/5 border border-gray-200`}>
                <Text className={`text-xs ${selectedFilter === item.value ? "text-indigo-600 font-psemibold" : "text-gray-400 font-pregular"}`}>{item.label}</Text>
                {item.icon}
            </TouchableOpacity>
        ))}
    </ScrollView>
    {outputFiltersText}
    </>
  )
}

export default ConversationsFilter