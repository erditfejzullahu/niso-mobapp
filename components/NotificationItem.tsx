import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { CarTaxiFront, DollarSign, MessageCircleMore, Settings, Trash2, Trophy, X, MapPin, Clock, User, Car, AlertCircle, CheckCircle } from "lucide-react-native";
import { Image, Modal, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Notification, NotificationConnectedRide, NotificationMetadatas, NotificationRideRequest, User as UserType, ConnectedRideStatus, RideRequestStatus } from "@/types/app-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/sq";
import { memo, useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useToggleNotifications } from "@/store/useToggleNotifications";
import { useQuery } from "@tanstack/react-query";
import api from "@/hooks/useApi";
import LoadingState from "./system/LoadingState";

dayjs.extend(relativeTime);
dayjs.locale('sq')

const NotificationItem = ({ item, onDelete , user}: { item: Notification; onDelete: (id: string) => void, user: UserType }) => {
  console.log(item);
  
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false)
    const {setToggled} = useToggleNotifications();
    
    const renderRightActions = () => (
        <TouchableOpacity
            onPress={() => onDelete(item.id)} 
            className="bg-red-600 w-20 justify-center items-center rounded-lg mr-3"
        >
            <Trash2 color="#fff" size={20} />
            <Text className="text-white text-xs font-pmedium mt-1">Fshij</Text>
        </TouchableOpacity>
    );

    const metadata: NotificationMetadatas | null = item.metadata ? JSON.parse(item.metadata || "{}") : null;    

    const connectedRideId = metadata?.navigateAction?.connectedRide || null;
    const connectedRideRequestId = metadata?.navigateAction?.rideRequest || null;

    const {data: connectedRideData, isLoading: connectedRideLoading, isRefetching: connectedRideRefetching, refetch: connectedRideRefetch, error: connectedRideError} = useQuery({
      queryKey: ['notifConnectedRide', item.id],
      queryFn: async () => {
        const res = await api.get<NotificationConnectedRide>(`/notifications/get-notification-connected-ride/${item.id}`);
        return res.data;
      },
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: (!!connectedRideId && openModal)
    })

    const {data: rideRequestData, isLoading: rideRequestLoading, isRefetching: rideRequestRefetching, refetch: rideRequestRefetch, error: rideRequestError} = useQuery({
      queryKey: ['notifRideRequest', item.id],
      queryFn: async () => {
        const res = await api.get<NotificationRideRequest>(`/notification/get-notification-ride-request/${item.id}`);
        return res.data;
      },
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: (!!connectedRideRequestId && openModal)
    })
    
    const handleNotificationItemActions = () => {
      if(metadata){
        if(metadata.modalAction){
          setOpenModal(true)
        }

        if(metadata.navigateAction){
            if(metadata.navigateAction.connectedRide){
              // Navigate to ride details
            }
            if(metadata.navigateAction.rideRequest){
              // Navigate to ride request details
            }
        }
      }
    }

    const getStatusIcon = (status: string) => {
      switch (status) {
        case RideRequestStatus.COMPLETED:
        case ConnectedRideStatus.COMPLETED:
            return <CheckCircle size={16} color="#10b981" />;
        case RideRequestStatus.WAITING:
        case ConnectedRideStatus.WAITING:
            return <Clock size={16} color="#f59e0b" />;
        case RideRequestStatus.CANCELLED:
        case ConnectedRideStatus.CANCELLED_BY_DRIVER:
        case ConnectedRideStatus.CANCELLED_BY_PASSENGER:
            return <AlertCircle size={16} color="#ef4444" />;
        case ConnectedRideStatus.DRIVING:
            return <Car size={16} color="#3b82f6" />;
        default:
            return <Clock size={16} color="#6b7280" />;
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
          case RideRequestStatus.COMPLETED:
          case ConnectedRideStatus.COMPLETED:
              return 'I përfunduar';
          case RideRequestStatus.WAITING:
              return 'Në pritje';
          case ConnectedRideStatus.WAITING:
              return 'Duke pritur';
          case RideRequestStatus.CANCELLED:
              return 'Anuluar';
          case ConnectedRideStatus.CANCELLED_BY_DRIVER:
              return 'Anuluar nga shoferi';
          case ConnectedRideStatus.CANCELLED_BY_PASSENGER:
              return 'Anuluar nga pasagjeri';
          case ConnectedRideStatus.DRIVING:
              return 'Në progres';
          default:
              return status;
      }
    };

    const notificationContext = useMemo(() => {
      switch (item.type) {
        case "SYSTEM_ALERT":
          return "Ky mesazh është gjeneruar nga sistemi për t'ju informuar mbi ndryshime ose paralajmërime.";
        case "MESSAGE":
          return "Ky mesazh ka ardhur nga një përdorues tjetër ose nga stafi i mbështetjes.";
        case "RIDE_UPDATE":
          // Add ride-specific context based on available data
          return "Ky njoftim lidhet me udhëtimin tuaj, duke reflektuar ndryshime ose azhurnime.";
          
          // if (connectedRideData) {
          //   rideContext += `\n\nStatusi: ${getStatusText(connectedRideData.status)}\nÇmimi: ${connectedRideData.rideRequest.price} €\nDistanca: ${connectedRideData.rideRequest.distanceKm} km`;
            
          //   if (connectedRideData.status === ConnectedRideStatus.CANCELLED_BY_DRIVER) {
          //     rideContext += "\n\nShoferi ka anuluar kërkesën tuaj për udhëtim.";
          //   } else if (connectedRideData.status === ConnectedRideStatus.CANCELLED_BY_PASSENGER) {
          //     rideContext += "\n\nPasagjeri ka anuluar udhëtimin.";
          //   } else if (connectedRideData.status === ConnectedRideStatus.DRIVING) {
          //     rideContext += "\n\nShoferi është duke vozitur drejt destinacionit.";
          //   }
          // } else if (rideRequestData) {
          //   rideContext += `\n\nStatusi: ${getStatusText(rideRequestData.status)}\nÇmimi: ${rideRequestData.price} €\nDistanca: ${rideRequestData.distanceKm} km`;
            
          //   if (rideRequestData.status === RideRequestStatus.CANCELLED) {
          //     rideContext += "\n\nKërkesa për udhëtim është anuluar.";
          //   }
          // }
          
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
          // Different text based on ride status
          if (connectedRideData) {
            if (connectedRideData.status === ConnectedRideStatus.COMPLETED) {
              return "Shiko Detajet";
            } else if (connectedRideData.status === ConnectedRideStatus.CANCELLED_BY_DRIVER || 
                      connectedRideData.status === ConnectedRideStatus.CANCELLED_BY_PASSENGER) {
              return "Kërko Një Tjetër";
            } else {
              return "Shiko Udhëtimin";
            }
          } else if (rideRequestData) {
            if (rideRequestData.status === RideRequestStatus.COMPLETED) {
              return "Shiko Detajet";
            } else if (rideRequestData.status === RideRequestStatus.CANCELLED) {
              return "Kërko Një Tjetër";
            } else {
              return "Shiko Kërkesën";
            }
          }
          return "Shiko Udhëtimin";
        case "PAYMENT":
          return "Shiko Pagesën";
        case "PROMOTIONAL":
          return "Shfrytëzo Ofertën";
        default:
          return "Vepro";
      }
    }, [item.type, connectedRideData, rideRequestData]);
    
    const handleActionPress = useCallback(() => {
      switch (item.type) {
        case "SYSTEM_ALERT":
          if(user.role === "DRIVER") router.push('/driver/section/profile'); 
          else router.push('/client/section/client-profile');
          break;
        case "MESSAGE":
          // Navigate to chat with the sender if available
          if (metadata?.notificationSender?.id) {

          }
          break;
        case "RIDE_UPDATE":
          // Navigate to the appropriate ride view
          if (connectedRideId) {

          } else if (connectedRideRequestId) {

          }
          break;
        case "PAYMENT":
          break;
        case "PROMOTIONAL":
          break;
        default:
          console.log("Veprim i përgjithshëm");
      }

      setOpenModal(false);
      setToggled(true);
    }, [item.type, metadata, connectedRideId, connectedRideRequestId, setOpenModal, setToggled, user.role]);



    const hasNotificationSenderInfos = metadata && metadata?.notificationSender

    // Render ride information if it's a ride update
    const renderRideInfo = () => {
      if (item.type !== "RIDE_UPDATE") return null;

      if (connectedRideRequestId && (connectedRideLoading || connectedRideRefetching)) {
        return (
          <LoadingState contStyle="!bg-white !mt-12" />
        );
      }

      if(connectedRideId && (connectedRideLoading || connectedRideRefetching)){
        return(
          <LoadingState contStyle="!bg-white !mt-12" />
        )
      }

      if(connectedRideId && !connectedRideLoading && connectedRideError) return (
        <View className="gap-2 bg-white shadow-lg shadow-black/10 rounded-2xl p-3 mb-3">
          <Text className="text-indigo-950 font-pmedium text-sm text-center">Dicka shkoi gabim ne ngarkimin e te dhenave te udhetimit(Udhetim i lidhur).</Text>
          <TouchableOpacity onPress={() => connectedRideRefetch()} className="bg-red-600 rounded-md py-3"><Text className="text-white font-pmedium text-center">Provo perseri</Text></TouchableOpacity>
        </View>
      )

      if(connectedRideRequestId && !rideRequestLoading && rideRequestError) return (
        <View className="gap-2 bg-white shadow-lg shadow-black/10 rounded-2xl p-3 mb-3">
          <Text className="text-indigo-950 font-pmedium text-sm text-center">Dicka shkoi gabim ne ngarkimin e te dhenave te udhetimit(Kerkesa e udhetimit).</Text>
          <TouchableOpacity onPress={() => rideRequestRefetch()} className="bg-red-600 rounded-md py-3"><Text className="text-white font-pmedium text-center">Provo perseri</Text></TouchableOpacity>
        </View>
      )

      
      if (connectedRideData) {
        return (
          <View className="p-3 shadow-lg shadow-black/10 bg-white border border-gray-200 rounded-lg mb-4">
            <Text className="font-psemibold text-indigo-900 text-base mb-2">Informacione për udhëtimin</Text>
            
            <View className="flex-row items-center self-start mx-auto mb-2 bg-indigo-50 justify-center p-2 rounded-md">
              {getStatusIcon(connectedRideData.status)}
              <Text className="ml-2 font-pregular text-gray-800 text-sm">
                Statusi: <Text className="text-indigo-900 font-pbold">{getStatusText(connectedRideData.status)}</Text>
              </Text>
            </View>
            
            <View className="flex-row items-start mb-2">
              <MapPin size={14} color="#4338ca" className="mt-1" />
              <Text className="ml-2 text-gray-600 flex-1 font-pregular text-sm">
                Nga: {connectedRideData.rideRequest.fromAddress}
              </Text>
            </View>
            
            <View className="flex-row items-start mb-2">
              <MapPin size={14} color="#4338ca" className="mt-1" />
              <Text className="ml-2 text-gray-600 flex-1 font-pregular text-sm">
                Deri: {connectedRideData.rideRequest.toAddress}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <DollarSign size={14} color="#4338ca" />
                <Text className="ml-2 text-gray-600 font-pregular text-sm">Çmimi:</Text>
                <Text className="ml-1 font-pbold text-sm text-indigo-900 ">
                  {connectedRideData.rideRequest.price} €
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Car size={14} color="#4338ca" />
                <Text className="ml-1 text-gray-600 font-pregular text-sm">Distanca:</Text>
                <Text className="ml-1 font-pbold text-indigo-900 text-sm">
                  {connectedRideData.rideRequest.distanceKm} km
                </Text>
              </View>
            </View>
            
            {connectedRideData.rideRequest.isUrgent && (
              <View className="mt-2 flex-row items-center bg-yellow-50 p-2 rounded-md">
                <AlertCircle size={14} color="#f59e0b" />
                <Text className="ml-2 text-yellow-800 text-sm font-pregular ">Udhëtim urgent</Text>
              </View>
            )}
            
            {/* Additional info based on status */}
            {connectedRideData.status === ConnectedRideStatus.CANCELLED_BY_DRIVER && (
              <View className="mt-2 flex-row items-center bg-red-50 p-2 rounded-md">
                <AlertCircle size={14} color="#ef4444" />
                <Text className="ml-2 text-red-800 text-sm font-pregular">Shoferi ka anuluar kërkesën tuaj për udhëtim</Text>
              </View>
            )}
            
            {connectedRideData.status === ConnectedRideStatus.CANCELLED_BY_PASSENGER && (
              <View className="mt-2 flex-row items-center bg-red-50 p-2 rounded-md">
                <AlertCircle size={14} color="#ef4444" />
                <Text className="ml-2 text-red-800 text-sm font-pregular">Pasagjeri ka anuluar udhëtimin</Text>
              </View>
            )}
          </View>
        );
      }
      
      if (rideRequestData) {
        return (
          <View className="p-3 shadow-lg shadow-black/10 bg-white border border-gray-200 rounded-lg mb-4">
            <Text className="font-psemibold text-indigo-900 text-base mb-2">Informacione për kërkesën e udhëtimit</Text>
            
            <View className="flex-row items-center self-start mx-auto mb-2 bg-indigo-50 justify-center p-2 rounded-md">
              {getStatusIcon(rideRequestData.status)}
              <Text className="ml-2 font-pmedium text-sm text-gray-800">
                Statusi: <Text className="text-indigo-900 font-pbold">{getStatusText(rideRequestData.status)}</Text>
              </Text>
            </View>
            
            <View className="flex-row items-start mb-2">
              <MapPin size={14} color="#4338ca" className="mt-1" />
              <Text className="ml-2 text-gray-600 text-sm flex-1 font-pregular">
                Nga: {rideRequestData.fromAddress}
              </Text>
            </View>
            
            <View className="flex-row items-start mb-2">
              <MapPin size={14} color="#4338ca" className="mt-1" />
              <Text className="ml-2 text-gray-600 text-sm flex-1 font-pregular">
                Deri: {rideRequestData.toAddress}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <DollarSign size={14} color="#4338ca" />
                <Text className="ml-1 text-gray-600 font-pregular">Çmimi:</Text>
                <Text className="ml-1 font-pbold text-sm text-indigo-900">
                  {rideRequestData.price} €
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Car size={14} color="#4338ca" />
                <Text className="ml-1 text-gray-600 font-pregular">Distanca:</Text>
                <Text className="ml-1 font-pbold text-sm text-indigo-900">
                  {rideRequestData.distanceKm} km
                </Text>
              </View>
            </View>
            
            {rideRequestData.isUrgent && (
              <View className="mt-2 flex-row items-center bg-yellow-50 p-2 rounded-md">
                <AlertCircle size={14} color="#f59e0b" />
                <Text className="ml-2 text-yellow-800 text-sm font-pregular">Udhëtim urgent</Text>
              </View>
            )}
            
            {/* Additional info for cancelled ride requests */}
            {rideRequestData.status === RideRequestStatus.CANCELLED && (
              <View className="mt-2 flex-row items-center bg-red-50 p-2 rounded-md">
                <AlertCircle size={14} color="#ef4444" />
                <Text className="ml-2 text-red-800 text-sm font-pregular">Kërkesa për udhëtim është anuluar</Text>
              </View>
            )}
          </View>
        );
      }
      
      return null;
    };


  return (
    <>
      <Swipeable renderRightActions={renderRightActions} containerStyle={{width: "100%", overflow: "visible"}}>
        <TouchableOpacity 
          onPress={handleNotificationItemActions}
          key={item.id} 
          className={`w-[95%] mx-auto flex-row items-center gap-2 ${
            item.read ? "bg-white" : "bg-indigo-50"
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
            <Text className={`font-pmedium ${item.read ? "text-indigo-900" : "text-indigo-950"} text-base`}>
              {item.title}
            </Text>
            <Text numberOfLines={2} className={`font-plight ${item.read ? "text-indigo-800" : "text-indigo-900"} text-xs`}>
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
          <View className="bg-white rounded-t-2xl p-5 shadow-lg shadow-black/30 max-h-[85%]">
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

            {/* Ride Information (only for RIDE_UPDATE) */}
            {item.type === "RIDE_UPDATE" && renderRideInfo()}

            <View className="p-3 shadow-lg shadow-black/10 bg-indigo-50 border border-gray-200 rounded-2xl mb-4">
              <View className="flex-row items-center gap-1 mb-1">
                <Text className="font-pmedium text-indigo-900 text-base">Konteksti i njoftimit</Text>
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