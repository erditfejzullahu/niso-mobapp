import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { CarTaxiFront, DollarSign, MessageCircleMore, Settings, Trash2, Trophy } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Notification } from "@/types/app-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/sq";
import { memo, useState } from "react";

dayjs.extend(relativeTime);
dayjs.locale('sq')

const NotificationItem = ({ item, onDelete }: { item: Notification; onDelete: (id: string) => void }) => {
    const [openModal, setOpenModal] = useState(false)

    const renderRightActions = () => (
        <TouchableOpacity
            onPress={() => onDelete(item.id)} 
            className="bg-red-600 w-20 justify-center items-center rounded-lg mr-3"
        >
            <Trash2 color="#fff" size={20} />
            <Text className="text-white text-xs font-pmedium mt-1">Fshij</Text>
        </TouchableOpacity>
    );

    const handleNotificationItemActions = () => {
        if(item.metadata?.modelAction){

        }
        if(item.metadata?.navigateAction){
            if(item.metadata.navigateAction.connectedRide){

            }
            if(item.metadata.navigateAction.rideRequest){

            }
        }
    }

    const hasNotificationSenderInfos = item.metadata && item.metadata.notificationSender


  return (
    <Swipeable renderRightActions={renderRightActions} containerStyle={{width: "100%", overflow: "visible"}}>
      <TouchableOpacity 
        onPress={handleNotificationItemActions}
        key={item.id} 
        className={`w-[95%] mx-auto flex-row items-center gap-2 ${
          item.read ? "bg-white" : "bg-indigo-950"
        } shadow-lg shadow-black/10 rounded-lg p-3 relative`}
      >
        {/* Left Icon */}
        <View className="absolute left-2 shadow-lg shadow-black/20 bg-gray-50 rounded-md p-0.5 top-2 z-50">
          {item.type === "SYSTEM_ALERT" && <Settings color={"#4338ca"} size={16} />}
          {item.type === "MESSAGE" && <MessageCircleMore color={"#4338ca"} size={16} />}
          {item.type === "RIDE_UPDATE" && <CarTaxiFront color={"#4338ca"} size={16} />}
          {item.type === "PAYMENT" && <DollarSign color={"#4338ca"} size={16} />}
          {item.type === "PROMOTIONAL" && <Trophy color={"#4338ca"} size={16} />}
        </View>

        {/* Avatar */}
        <Image
          source={{ uri: hasNotificationSenderInfos ? item.metadata?.notificationSender?.image : item.user.image }}
          className="w-14 h-14 rounded-full"
        />

        {/* Content */}
        <View className="pb-[14px] flex-1">
          <Text className={`font-pmedium ${item.read ? "text-indigo-900" : "text-white"} text-base`}>
            {item.title}
          </Text>
          <Text className={`font-plight ${item.read ? "text-indigo-950" : "text-white"} text-xs`}>
            {item.message}
          </Text>
        </View>

        {/* Date */}
        <Text className="absolute bottom-1 right-1 text-indigo-950 font-pregular text-xs bg-white rounded-md px-2 py-0.5 shadow-sm shadow-black/20 border-gray-200">
          {dayjs(item.createdAt ?? new Date()).fromNow()}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );
};
export default memo(NotificationItem)