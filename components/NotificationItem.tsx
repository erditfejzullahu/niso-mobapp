import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { CarTaxiFront, DollarSign, MessageCircleMore, Settings, Trash2, Trophy, X } from "lucide-react-native";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { Notification, NotificationMetadatas, User } from "@/types/app-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/sq";
import { memo, useCallback, useMemo, useState } from "react";
import { router } from "expo-router";
import { useToggleNotifications } from "@/store/useToggleNotifications";

dayjs.extend(relativeTime);
dayjs.locale('sq')

const NotificationItem = ({ item, onDelete , user}: { item: Notification; onDelete: (id: string) => void, user: User }) => {
    console.log(item);
    
    const [openModal, setOpenModal] = useState(false)
    const {isClosed, setToggled} = useToggleNotifications();
    

    
    const renderRightActions = () => (
        <TouchableOpacity
            onPress={() => onDelete(item.id)} 
            className="bg-red-600 w-20 justify-center items-center rounded-lg mr-3"
        >
            <Trash2 color="#fff" size={20} />
            <Text className="text-white text-xs font-pmedium mt-1">Fshij</Text>
        </TouchableOpacity>
    );

    const metadata: NotificationMetadatas | null = item.metadata ? JSON.parse(item.metadata) : null;
    
    const handleNotificationItemActions = () => {
      if(metadata){
        if(metadata.modalAction){
          setOpenModal(true)
        }

        if(metadata.navigateAction){
            if(metadata.navigateAction.connectedRide){

            }
            if(metadata.navigateAction.rideRequest){

            }
        }
      }
    }

    const notificationContext = useMemo(() => {
      switch (item.type) {
        case "SYSTEM_ALERT":
          return "Ky mesazh është gjeneruar nga sistemi për t'ju informuar mbi ndryshime ose paralajmërime.";
        case "MESSAGE":
          return "Ky mesazh ka ardhur nga një përdorues tjetër ose nga stafi i mbështetjes.";
        case "RIDE_UPDATE":
          return "Ky njoftim lidhet me udhëtimin tuaj, duke reflektuar ndryshime ose azhurnime.";
        case "PAYMENT":
          return "Ky mesazh ka lidhje me pagesat tuaja, faturat ose transaksionet e kryera.";
        case "PROMOTIONAL":
          return "Ky është një njoftim promovues me oferta, shpërblime ose kampanja speciale.";
        default:
          return "Ky është një njoftim i përgjithshëm.";
      }
    }, [item.type]);


    const actionButtonText = useMemo(() => {
      switch (item.type) {
        case "SYSTEM_ALERT":
          return "Shiko Detajet";
        case "MESSAGE":
          return "Përgjigju";
        case "RIDE_UPDATE":
          return "Shiko Udhëtimin";
        case "PAYMENT":
          return "Shiko Pagesën";
        case "PROMOTIONAL":
          return "Shfrytëzo Ofertën";
        default:
          return "Vepro";
      }
    }, [item.type]);
    
    const handleActionPress = useCallback(() => {
      switch (item.type) {
        case "SYSTEM_ALERT":
          console.log("Navigo tek detajet e sistemit");
          if(user.role === "DRIVER") router.push('/driver/section/profile'); else router.push('/client/section/client-profile');
          break;
        case "MESSAGE":
          console.log("Hap chat me përdoruesin");
          // p.sh. navigate('Chat', { userId: metadata?.notificationSender?.id });
          break;
        case "RIDE_UPDATE":
          console.log("Shiko detajet e udhëtimit");
          // p.sh. navigate('RideDetails', { rideId: metadata?.navigateAction?.connectedRide });
          break;
        case "PAYMENT":
          console.log("Shiko pagesën");
          // p.sh. navigate('PaymentDetails', { paymentId: metadata?.navigateAction?.paymentId });
          break;
        case "PROMOTIONAL":
          console.log("Shfrytëzo ofertën");
          // p.sh. navigate('PromotionDetails', { promoId: metadata?.navigateAction?.promoId });
          break;
        default:
          console.log("Veprim i përgjithshëm");
      }

      setOpenModal(false);
      setToggled(true);
    }, [item.type, metadata, setOpenModal, setToggled]);



    const hasNotificationSenderInfos = metadata && metadata?.notificationSender


  return (
    <>
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
            source={{ uri: hasNotificationSenderInfos ? metadata.notificationSender?.image : item.user.image }}
            className="w-14 h-14 rounded-full"
          />

          {/* Content */}
          <View className="pb-[14px] flex-1">
            <Text className={`font-pmedium ${item.read ? "text-indigo-900" : "text-white"} text-base`}>
              {item.title}
            </Text>
            <Text numberOfLines={2} className={`font-plight ${item.read ? "text-indigo-950" : "text-white"} text-xs`}>
              {item.message}
            </Text>
          </View>

          {/* Date */}
          <Text className="absolute bottom-1 right-1 text-indigo-950 font-pregular text-xs bg-white rounded-md px-2 py-0.5 shadow-sm shadow-black/20 border-gray-200">
            {dayjs(item.createdAt ?? new Date()).fromNow()}
          </Text>
        </TouchableOpacity>
      </Swipeable>

      <Modal
        visible={openModal}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-5 shadow-lg shadow-black/30">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-psemibold text-indigo-900">Detajet e njoftimit</Text>
              <TouchableOpacity onPress={() => setOpenModal(false)}>
                <X size={22} color="#4338ca" />
              </TouchableOpacity>
            </View>

            {/* Notification Content */}
            <View className="flex-row items-center gap-3 mb-4">
              <Image
                source={{ uri: hasNotificationSenderInfos ? metadata.notificationSender?.image : item.user.image }}
                className="w-12 h-12 rounded-full"
              />
              <View className="flex-1">
                <Text className="text-base font-pmedium text-indigo-950">{item.title}</Text>
                <Text className="text-sm text-gray-600 font-plight">{item.message}</Text>
              </View>
            </View>

            <View className="p-3 shadow-lg shadow-black/10 bg-indigo-50 border border-gray-200 rounded-lg mb-4 pb-3.5">
              <View className="flex-row items-center gap-1 ">
                <Text className="font-pmedium text-indigo-960 text-lg">Konteksti i njoftimit</Text>
                {item.type === "SYSTEM_ALERT" && <Settings color={"#4338ca"} size={16} />}
                {item.type === "MESSAGE" && <MessageCircleMore color={"#4338ca"} size={16} />}
                {item.type === "RIDE_UPDATE" && <CarTaxiFront color={"#4338ca"} size={16} />}
                {item.type === "PAYMENT" && <DollarSign color={"#4338ca"} size={16} />}
                {item.type === "PROMOTIONAL" && <Trophy color={"#4338ca"} size={16} />}
              </View>
              <Text className="font-pregular text-sm text-indigo-600">
                {notificationContext}
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={() => setOpenModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-200"
              >
                <Text className="text-indigo-900 font-pmedium">Mbyll</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleActionPress()
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600"
              >
                <Text className="text-white font-pmedium">{actionButtonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
export default memo(NotificationItem)