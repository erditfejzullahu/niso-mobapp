import { View, Text, TouchableOpacity, Image, Modal, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native'
import React, { memo, useState } from 'react'
import { Conversations, Message, User } from '@/types/app-types'
import { CarTaxiFront, Check, CheckCheck, Clock, Send, Settings, Trash2, X } from 'lucide-react-native';
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/sq";
import Animated, { BounceInDown, BounceInRight, BounceInUp } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import api from '@/hooks/useApi';
import { paginationDto } from '@/utils/paginationDto';
import EmptyState from './system/EmptyState';
import LoadingState from './system/LoadingState';
import ErrorState from './system/ErrorState';
dayjs.extend(relativeTime);
dayjs.locale('sq')

const ConversationItem = ({user, item, onDelete, sheetSection = false}: {user: User, item: Conversations, onDelete: (id: string) => void, sheetSection: boolean}) => {
    const [conversationModal, setConversationModal] = useState(false);
    const [pagination, setPagination] = useState({...paginationDto});
    const [messageDetailsModal, setMessageDetailsModal] = useState<Message | null>(null)

    const renderRightActions = () => (
        <TouchableOpacity
            onPress={() => onDelete(item.id)} 
            className="bg-red-600 w-20 justify-center items-center rounded-lg mr-3"
        >
            <Trash2 color="#fff" size={20} />
            <Text className="text-white text-xs font-pmedium mt-1">Fshij</Text>
        </TouchableOpacity>
    );

    const {data, isLoading, error, refetch, isRefetching} = useQuery({
        queryKey: ['conversation-item', item.id],
        queryFn: async () => {
            const res = await api.get<Message[]>(`/conversations/get-messages/${item.id}`, {params: pagination})
            return res.data;
        },
        refetchOnWindowFocus: false,
        enabled: conversationModal
    })

    const handleConversationClickAction = () => {
        if(sheetSection){
            setConversationModal(true);
        }else{

        }
    };

    const youMessagedLast = user.id === item.messages[0].senderId;
    const isRead = item.messages[0].isRead;

    const outputNecessariesTopLeftSide = {
        image: (user.role === "DRIVER") ? (item.passenger?.image || item.support?.image) : (user.role === "PASSENGER") ? (item.driver?.image || item.support?.image) : (item.driver?.image || item.passenger?.image),
        fullName: (user.role === "DRIVER") ? (item.passenger?.fullName || item.support?.fullName) : (user.role === "PASSENGER") ? (item.driver?.fullName || item.support?.image) : (item.driver?.fullName || item.passenger?.image),
        id: (user.role === "DRIVER") ? (item.passenger?.id || item.support?.id) : (user.role === "PASSENGER") ? (item.driver?.id || item.support?.id) : (item.driver?.id || item.passenger?.id),
    };

    return (
    <>
        <Swipeable renderRightActions={renderRightActions} containerStyle={{width: "100%", overflow: "visible"}}>
            <TouchableOpacity
                onPress={handleConversationClickAction}
                className={`w-[95%] mx-auto flex-row items-center gap-2 ${
                    (!isRead && youMessagedLast) ? "bg-white" : (!isRead && !youMessagedLast) ? "bg-indigo-100" : "bg-white"
                } shadow-lg shadow-black/10 rounded-lg p-3 relative`}
            >
                {/* Left Icon */}
                <View className="absolute left-2 shadow-lg shadow-black/20 bg-gray-50 rounded-md p-0.5 top-2 z-50">
                    {item.type === "RIDE_RELATED" && <CarTaxiFront color={"#4338ca"} size={16} />}
                    {item.type === "SUPPORT" && <MaterialIcons name='support-agent' color={"#4338ca"} size={16} />}
                    {item.type === "OTHER" && <Settings color={"#4338ca"} size={16} />}
                </View>

                <View className='absolute right-2 top-2 z-50'>
                    {(youMessagedLast && !isRead) && <Check size={16} color={"#dc2626"}/>}
                    {(youMessagedLast && isRead) && <CheckCheck size={16} color={"#dc2626"} />}
                </View>

                <Image 
                    source={{uri: outputNecessariesTopLeftSide.image}}
                    className='w-14 h-14 rounded-full'
                />

                <View className="pb-[14px] flex-1">
                    <Text className={`font-pmedium ${(!isRead && youMessagedLast) ? "text-indigo-900" : (!isRead && !youMessagedLast) ? "text-indigo-950" : "text-indigo-900"} text-base`}>
                        {outputNecessariesTopLeftSide.fullName}
                    </Text>
                    <Text numberOfLines={2} className={`font-plight ${(!isRead && youMessagedLast) ? "text-indigo-800" : (!isRead && !youMessagedLast) ? "text-indigo-900" : "text-indigo-800"} text-xs`}>
                        {item.messages[0].content}
                    </Text>
                </View>
                
                <View className='absolute right-1 bottom-1 flex-row items-center gap-2'>
                    <Text className={`text-xs font-pregular px-2 py-0.5 rounded-md shadow-sm shadow-black/20 ${item.type === "RIDE_RELATED" ? "bg-red-600" : item.type === "SUPPORT" ? "bg-indigo-600" : "bg-cyan-600"} text-white`}>{item.type === "RIDE_RELATED" ? "Lidhur me Udhetimin" : item.type === "SUPPORT" ? "Mbeshtetje Online" : "Bisede me qellime te ndryshme"}</Text>
                    <Text className="text-indigo-950 font-pregular text-xs bg-white rounded-md px-2 py-0.5 shadow-sm shadow-black/20">
                        {dayjs(item.lastMessageAt ?? new Date()).fromNow()}
                    </Text>
                </View>
            </TouchableOpacity>
        </Swipeable>

        {/* ✅ Modern Conversation Modal */}
        {sheetSection && <Modal
            visible={conversationModal}
            animationType="slide"
            onRequestClose={() => setConversationModal(false)}
            transparent={true}
        >
            <View className="flex-1 bg-black/30 justify-center">
                <Animated.View entering={BounceInRight.duration(800)}>
                    <TouchableOpacity onPress={() => setConversationModal(false)} className='ml-auto mr-4 mb-2 z-50'>
                        <Image 
                            source={{uri: outputNecessariesTopLeftSide.image}}
                            className='w-20 h-20 rounded-full'
                        />
                    </TouchableOpacity>
                </Animated.View>

                <KeyboardAvoidingView
                    className="bg-white rounded-2xl mx-3 h-[70%] shadow-lg shadow-black/30 overflow-hidden"
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View className='flex-1'>
                        {/* Header */}
                        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                            <Animated.View entering={BounceInUp.duration(800)} className="flex-row items-center gap-2">
                                <Image source={{uri: outputNecessariesTopLeftSide.image}} className="w-14 h-14 rounded-full"/>
                                <View>
                                    <Text className="font-psemibold text-lg text-indigo-950">{outputNecessariesTopLeftSide.fullName}</Text>
                                    <Text className={`text-xs font-pregular px-2 py-0.5 rounded-lg ${item.type === "RIDE_RELATED" ? "bg-red-600" : item.type === "SUPPORT" ? "bg-indigo-600" : "bg-cyan-600"} text-white`}>{item.type === "RIDE_RELATED" ? "Lidhur me Udhetimin" : item.type === "SUPPORT" ? "Mbeshtetje Online" : "Bisede me qellime te ndryshme"}</Text>
                                </View>
                            </Animated.View>
                            <TouchableOpacity onPress={() => setConversationModal(false)}>
                                <X color="#4f46e5" />
                            </TouchableOpacity>
                        </View>

                        {isLoading || isRefetching ? (
                            <LoadingState />
                        ) : ((!isLoading && !isRefetching) && error) ? (
                            <ErrorState onRetry={refetch}/>
                        ) : (
                            <FlatList
                                data={data}
                                keyExtractor={(msg) => msg.id}
                                contentContainerStyle={{padding: 12}}
                                renderItem={({item: msg}) => {
                                    const isMine = msg.senderId === user.id;
                                    const isMessageRead = msg.isRead && msg.isRead === true;
                                    const isMessageNotSent = msg.isRead === null;
                                    return (
                                        <TouchableOpacity onPress={() => setMessageDetailsModal(msg)} className={`mb-3 max-w-[75%] ${isMine ? "self-end" : "self-start"}`}>
                                            <View className={`rounded-2xl px-3 py-2 shadow-sm ${isMine ? "bg-indigo-600" : "bg-gray-200"}`}>
                                                <Text className={`text-sm font-pregular ${isMine ? "text-white" : "text-indigo-950"}`}>
                                                    {msg.content}
                                                </Text>
                                            </View>
                                            <View className='flex-row items-center justify-between'>
                                                <Text className="text-[10px] text-gray-400 mt-0.5">{dayjs(msg.createdAt).fromNow()}</Text>
                                                <View>
                                                    {(isMine && !isMessageRead) && <Check size={16} color={"#4f46e5"}/>}
                                                    {(isMine && isMessageRead) && <CheckCheck size={16} color={"#4f46e5"} />}
                                                    {(isMine && isMessageNotSent) && <Clock size={12} color={"#4f46e5"}/>}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                                ListEmptyComponent={() => (
                                    <EmptyState 
                                        containerStyle='!bg-white'
                                        message='Nuk ka bisede ende. Filloni duke derguar nje mesazh nga kutia e meposhtme. Nese mendoni qe eshte gabim ju lutem provoni perseri.'
                                        onRetry={refetch}
                                        textStyle='!font-pregular !text-sm'  
                                    />
                                )}
                            />
                        )}


                        {/* Input Box */}
                        <Animated.View entering={BounceInDown.duration(800)} className="flex-row items-center border-t border-gray-200 p-3 bg-white">
                            <TextInput
                                placeholder="Shkruaj një mesazh..."
                                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm font-pregular"
                                multiline
                            />
                            <TouchableOpacity className="ml-2 bg-indigo-600 rounded-full p-2">
                                <Send size={18} color="#fff" />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>}
    </>
  )
}

export default memo(ConversationItem)
