import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { Conversations, User } from '@/types/app-types'
import { CarTaxiFront, Settings, Trash2 } from 'lucide-react-native';
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/sq";
dayjs.extend(relativeTime);
dayjs.locale('sq')

const ConversationItem = ({user, item, onDelete}: {user: User, item: Conversations, onDelete: (id: string) => void}) => {

    const renderRightActions = () => (
        <TouchableOpacity
            onPress={() => onDelete(item.id)} 
            className="bg-red-600 w-20 justify-center items-center rounded-lg mr-3"
        >
            <Trash2 color="#fff" size={20} />
            <Text className="text-white text-xs font-pmedium mt-1">Fshij</Text>
        </TouchableOpacity>
    );

    const handleConversationClickAction = () => {
        console.log(item);
    }

    const youMessagedLast = user.id === item.messages[0].senderId;
    const isRead = item.messages[0].isRead;

    const outputNecessariesTopLeftSide = {
        image: (user.role === "DRIVER") ? (item.passenger?.image || item.support?.image) : (user.role === "PASSENGER") ? (item.driver?.image || item.support?.image) : (item.driver?.image || item.passenger?.image),
        fullName: (user.role === "DRIVER") ? (item.passenger?.fullName || item.support?.fullName) : (user.role === "PASSENGER") ? (item.driver?.fullName || item.support?.image) : (item.driver?.fullName || item.passenger?.image),
        id: (user.role === "DRIVER") ? (item.passenger?.id || item.support?.id) : (user.role === "PASSENGER") ? (item.driver?.id || item.support?.id) : (item.driver?.id || item.passenger?.id),
    }
    
  return (
    <>
        <Swipeable key={item.id} renderRightActions={renderRightActions} containerStyle={{width: "100%", overflow: "visible"}}>
            <TouchableOpacity
                onPress={handleConversationClickAction}
                className={`w-[95%] mx-auto flex-row items-center gap-2 ${
                    (!isRead && youMessagedLast) ? "bg-white" : (!isRead && !youMessagedLast) ? "bg-indigo-100" : "bg-indigo-600"
                } shadow-lg shadow-black/10 rounded-lg p-3 relative`}
            >
                {/* Left Icon */}
                <View className="absolute left-2 shadow-lg shadow-black/20 bg-gray-50 rounded-md p-0.5 top-2 z-50">
                    {item.type === "RIDE_RELATED" && <CarTaxiFront color={"#4338ca"} size={16} />}
                    {item.type === "SUPPORT" && <MaterialIcons name='support-agent' color={"#4338ca"} size={16} />}
                    {item.type === "OTHER" && <Settings color={"#4338ca"} size={16} />}
                </View>

                <Image 
                    source={{uri: outputNecessariesTopLeftSide.image}}
                    className='w-14 h-14 rounded-full'
                />

                <View className="pb-[14px] flex-1">
                    <Text className={`font-pmedium ${(!isRead && youMessagedLast) ? "text-indigo-900" : (!isRead && !youMessagedLast) ? "text-indigo-950" : "text-red-500"} text-base`}>
                    {outputNecessariesTopLeftSide.fullName}
                    </Text>
                    <Text numberOfLines={2} className={`font-plight ${(!isRead && youMessagedLast) ? "text-indigo-800" : (!isRead && !youMessagedLast) ? "text-indigo-900" : "text-reg-500"} text-xs`}>
                    {item.messages[0].content}
                    </Text>
                </View>

                <Text className="absolute bottom-1 right-1 text-indigo-950 font-pregular text-xs bg-white rounded-md px-2 py-0.5 shadow-sm shadow-black/20 border-gray-200">
                    {dayjs(item.lastMessageAt ?? new Date()).fromNow()}
                </Text>
                
            </TouchableOpacity>
        </Swipeable>
    </>
  )
}

export default ConversationItem