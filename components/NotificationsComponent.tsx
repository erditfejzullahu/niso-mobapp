import { useToggleNotifications } from "@/store/useToggleNotifications";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React, { memo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';


const fakeNotifications = [
  'Tarifa juaj u aprovua ✅',
  'Keni një udhëtim të ri 📍',
  'Pagesa prej €5.00 u pranua 💳',
  'Përdoruesi ju dha vlerësim 5⭐',
];


const NotificationsComponent = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
    const {isOpened} = useToggleNotifications();
    console.log(isOpened);
    
    if(isOpened) bottomSheetRef.current?.dismiss(); else bottomSheetRef.current?.present();

  return (
    <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1} // Start expanded
          snapPoints={["100%", '100%']}
          enableDynamicSizing={false}
          enablePanDownToClose={true}
          style={styles.bottomSheet}
          backdropComponent={({ style }) => (
            <View 
              style={[style, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
              onTouchEnd={() => bottomSheetRef.current?.dismiss()}
            />
          )}
        >
          <View style={styles.bottomSheetContent}>
            {fakeNotifications.map((item, idx) => (
                <Text key={idx} className="font-pregular text-sm">{item}</Text>
            ))}
          </View>
        </BottomSheetModal>
        </BottomSheetModalProvider>
  )
}

export default memo(NotificationsComponent)

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
})