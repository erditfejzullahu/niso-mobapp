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
import api from '@/hooks/useApi'
import { useSocketEvent } from '@/hooks/useSocketEvent'
import { SERVER_SOCKET_EVENTS } from '@/types/socket-events'

const TopbarComponent = ({navigation}: {navigation: DrawerNavigationProp<ParamListBase>}) => {
    const drawerOpen = useDrawerStatus() === "open";
    const {user} = useAuth();
    const [open, setOpen] = useState(drawerOpen)
    const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
    const [unreadMessages, setUnreadMessages] = useState<number>(0);
    const insets = useSafeAreaInsets();

    useEffect(() => {
      setOpen(drawerOpen)
    }, [drawerOpen])

    useEffect(() => {
      let cancelled = false;
      const run = async () => {
        if (!user) {
          setUnreadNotifications(0);
          setUnreadMessages(0);
          return;
        }
        try {
          const [nRes, mRes] = await Promise.all([
            api.get<{ count: number }>('/notifications/unread-count'),
            api.get<{ count: number }>('/conversations/unread-count'),
          ]);
          if (cancelled) return;
          setUnreadNotifications(Number(nRes.data?.count ?? 0));
          setUnreadMessages(Number(mRes.data?.count ?? 0));
        } catch {
          // keep previous values if request fails
        }
      };
      void run();
      return () => {
        cancelled = true;
      };
    }, [user]);

    useSocketEvent(
      SERVER_SOCKET_EVENTS.unreadNotificationsCounter,
      (count) => setUnreadNotifications(Number(count ?? 0)),
      !!user
    );

    useSocketEvent(
      SERVER_SOCKET_EVENTS.unreadMessagesCounter,
      (count) => setUnreadMessages(Number(count ?? 0)),
      !!user
    );

    const handleToggle = (next: boolean) => {
        setOpen(next);
        if(next) navigation.openDrawer();
        else navigation.closeDrawer();
    }

    const {setToggled, isClosed} = useToggleNotifications();
    const {setToggled: setMessageSheetToggle, isClosed: messageSheetIsClosed} = useToggleMessagesSheet();

    const BAR_HEIGHT = 56;
    const totalHeight = insets.top + BAR_HEIGHT;

    const formatBadge = (count: number) => (count > 99 ? '99+' : String(count));
    
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
            <View>
              <MessagesSquare color={!messageSheetIsClosed ? "#4f46e5" : "#1e1b4b"} size={22}/>
              {unreadMessages > 0 ? (
                <View className="absolute -top-2 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-red-600 items-center justify-center">
                  <Text className="text-white text-[10px] font-psemibold">{formatBadge(unreadMessages)}</Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setToggled(false)} hitSlop={10}>
            <View>
              <Bell color={!isClosed ? "#4f46e5" : "#1e1b4b"} size={22}/>
              {unreadNotifications > 0 ? (
                <View className="absolute -top-2 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-red-600 items-center justify-center">
                  <Text className="text-white text-[10px] font-psemibold">{formatBadge(unreadNotifications)}</Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
          <AnimatedHamburger toggled={open} onToggle={handleToggle} color='#1e1b4b'/>
        </View>
      </View>
    </View>
  )
}

export default TopbarComponent