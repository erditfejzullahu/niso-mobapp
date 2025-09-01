import api from "@/hooks/useApi";
import { useToggleNotifications } from "@/store/useToggleNotifications";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/sq";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { memo, useRef } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoadingState from "./system/LoadingState";
import ErrorState from "./system/ErrorState";
import EmptyState from "./system/EmptyState";
import { Notification } from "@/types/app-types";
import { CarTaxiFront, DollarSign, MessageCircleMore, Settings, Trophy } from "lucide-react-native";
import NotificationItem from "./NotificationItem";

dayjs.extend(relativeTime);
dayjs.locale('sq')



const NotificationsComponent = () => {
  const fakeNotifications = [
    {message: "Tarifa juaj u aprovua ✅", isRead: true},
    {message: "Keni një udhëtim të ri 📍", isRead: false},
    {message: "Tarifa juaj u aprovua ✅", isRead: true},
    {message: "Keni një udhëtim të ri 📍", isRead: false},
    {message: "Tarifa juaj u aprovua ✅", isRead: true},
    {message: "Pagesa prej €5.00 u pranua 💳", isRead: false},
    {message: "Përdoruesi ju dha vlerësim 5⭐", isRead: true},
    {message: "Përdoruesi ju dha vlerësim 5⭐", isRead: false},
    {message: "Përdoruesi ju dha vlerësim 5⭐", isRead: true},
    {message: "Përdoruesi ju dha vlerësim 5⭐", isRead: false},
    {message: "Përdoruesi ju dha vlerësim 5⭐", isRead: false},
    {message: "Përdoruesi ju dha vlerësim 5⭐", isRead: true},
  ];

  

  


  const bottomSheetRef = useRef<BottomSheetModal>(null)
    const {isClosed, setToggled} = useToggleNotifications();
    const dateCreated = "2025-08-09T14:22:00Z";
    const clientPhoto ="https://randomuser.me/api/portraits/men/32.jpg";

    if (isClosed) {
        bottomSheetRef.current?.dismiss();
    } else {
        bottomSheetRef.current?.present();
    }

    const {data, error, isLoading, isRefetching, refetch} = useQuery({
      queryKey: ['notifications'],
      queryFn: async () => {
        const [getNotifications, makeReadNotifications] = await Promise.all([
          api.get<Notification[]>('/notifications/get-notifications'),
          api.patch('/notifications/read-notifications'),
        ])
        return getNotifications;
      },
      refetchOnWindowFocus: false,
      enabled: !isClosed
    })

    const deleteNotification = (id: string) => {
      
    }
    

    const handleSheetChange = () => {

    }

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
                  {isLoading || isRefetching ? (
                    <LoadingState />
                  ) : ((!isLoading && !isRefetching) && error ? (
                    <ErrorState onRetry={refetch}/>
                  ) : !data || data.data.length === 0 ? (
                    <EmptyState onRetry={refetch} message="Nuk u gjeten njoftime. Nese mendoni qe eshte gabim klikoni me poshte." textStyle="!font-plight !text-sm" />
                  ) : (
                    <View className="w-full gap-2.5">
                    {data.data.map((item) => (
                      <NotificationItem item={item} onDelete={(id) => deleteNotification(id)}/>
                    ))}
                    </View>
                  ))}
                </BottomSheetScrollView>
            </>
        </BottomSheetModal>
        </BottomSheetModalProvider>
  )
}

export default memo(NotificationsComponent)

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