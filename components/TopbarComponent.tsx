import { useToggleNotifications } from '@/store/useToggleNotifications'
import { DrawerNavigationProp, useDrawerStatus } from '@react-navigation/drawer'
import { ParamListBase } from '@react-navigation/native'
import { Bell, MessagesSquare } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AnimatedHamburger from './AnimatedHamburger'
import { useToggleMessagesSheet } from '@/store/useToggleMessagesSheet'
import { router } from 'expo-router'
import { getUserRole } from '@/utils/usefulFunctions'
import { useAuth } from '@/context/AuthContext'
import { Role } from '@/types/app-types'

const TopbarComponent = ({navigation}: {navigation: DrawerNavigationProp<ParamListBase>}) => {
    const drawerOpen = useDrawerStatus() === "open";
    const {user} = useAuth();
    const [open, setOpen] = useState(drawerOpen)
    const insets = useSafeAreaInsets();

    useEffect(() => {
      setOpen(drawerOpen)
    }, [drawerOpen])

    const handleToggle = (next: boolean) => {
        setOpen(next);
        if(next) navigation.openDrawer();
        else navigation.closeDrawer();
    }

    const {setToggled, isClosed} = useToggleNotifications();
    const {setToggled: setMessageSheetToggle, isClosed: messageSheetIsClosed} = useToggleMessagesSheet();

    const BAR_HEIGHT = 56;
    const totalHeight = insets.top + BAR_HEIGHT;
    
  return (
    <View className='bg-gray-50 px-4 relative z-50' style={{ paddingTop: insets.top }}>
      <View
        className='absolute top-0 left-0 right-0 bg-white rounded-b-[20px] shadow-md shadow-black/10'
        style={{ height: totalHeight }}
        pointerEvents="none"
      />

      <View className='flex-row items-center justify-between' style={{ height: BAR_HEIGHT }}>
        <Pressable
          className='flex-row items-center'
          onPress={() => {
            if (!user) {
              router.replace('/(auth)/sign-in');
              return;
            }
            router.replace(
              getUserRole(user) === Role.DRIVER ? '/driver/section/active-routes' : '/client/section/client-home'
            );
          }}
          hitSlop={10}
        >
          <Text className='font-psemibold pt-2 text-indigo-950 text-3xl leading-none -mb-2'>
            Niso
          </Text>
          <Text className='text-indigo-600 font-black text-5xl leading-none'>.</Text>
        </Pressable>

        <View className='flex-row items-center gap-3'>
          <TouchableOpacity onPress={() => setMessageSheetToggle(false)} hitSlop={10}>
            <MessagesSquare color={!messageSheetIsClosed ? "#4f46e5" : "#1e1b4b"} size={22}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setToggled(false)} hitSlop={10}>
            <Bell color={!isClosed ? "#4f46e5" : "#1e1b4b"} size={22}/>
          </TouchableOpacity>
          <AnimatedHamburger toggled={open} onToggle={handleToggle} color='#1e1b4b'/>
        </View>
      </View>
    </View>
  )
}

export default TopbarComponent