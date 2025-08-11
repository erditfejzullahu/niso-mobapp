import { useToggleNotifications } from "@/store/useToggleNotifications";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import "dayjs/locale/sq";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { memo, useRef } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

dayjs.extend(relativeTime);
dayjs.locale('sq')

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


const NotificationsComponent = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
    const {isClosed, setToggled} = useToggleNotifications();
    console.log(isClosed);
    const dateCreated = "2025-08-09T14:22:00Z";
    const clientPhoto ="https://randomuser.me/api/portraits/men/32.jpg";

    if (isClosed) {
        bottomSheetRef.current?.dismiss();
    } else {
        bottomSheetRef.current?.present();
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
                    {fakeNotifications.map((item, idx) => (
                        <TouchableOpacity key={idx} className={`w-full flex-row items-center gap-2 ${item.isRead ? "bg-white" : "bg-indigo-950 animate-pulse"} shadow-lg shadow-black/10 my-1 rounded-lg p-3`}>
                            <View>
                                <Image 
                                    source={{uri: clientPhoto}}
                                    className="w-12 h-12 rounded-full"
                                />
                            </View>
                            <View className="pb-[14px] flex-1">
                                <Text className={`font-pregular ${item.isRead ? "text-indigo-950" : "text-white"} text-sm break-words`}>{item.message}</Text>
                            </View>
                                <Text className="absolute bottom-1 right-1 text-indigo-950 font-pregular text-xs bg-white rounded-md px-2 py-0.5 shadow-sm shadow-black/20  border-gray-200">{dayjs(dateCreated).fromNow()}</Text>
                        </TouchableOpacity>
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
    // flex: 1,
    // padding: 16,
    paddingBottom: 60,
    paddingTop: 2,
    paddingInline: 8,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderTopColor: "rgba(0,0,0,0.05)",
    borderTopWidth: 1,
  },
})