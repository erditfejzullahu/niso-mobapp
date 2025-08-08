import { DrawerNavigationProp, useDrawerStatus } from '@react-navigation/drawer'
import { ParamListBase } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AnimatedHamburger from './AnimatedHamburger'

const TopbarComponent = ({navigation}: {navigation: DrawerNavigationProp<ParamListBase>}) => {
    const drawerOpen = useDrawerStatus() === "open";
    const [open, setOpen] = useState(drawerOpen)

    useEffect(() => {
      setOpen(drawerOpen)
    }, [drawerOpen])

    const handleToggle = (next: boolean) => {
        setOpen(next);
        if(next) navigation.openDrawer();
        else navigation.closeDrawer();
    }
    
  return (
    <SafeAreaView className='bg-white px-4 max-h-[83px] shadow-md shadow-black/10 rounded-b-[20px]'>
        <View className='flex-row items-center justify-between'>
            <View>
                <Text className='font-psemibold text-3xl -mb-6 pt-2.5'>Niso<Text className='text-indigo-600 font-black text-6xl'>.</Text></Text>
            </View>
            <View>
                <AnimatedHamburger toggled={open} onToggle={handleToggle} color='#4f46e5'/>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default TopbarComponent