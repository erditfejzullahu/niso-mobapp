import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import React, { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';

const ProtectedRoute = ({children}: {children: ReactNode}) => {
    const {currentUser, loading} = useAuth();

    if(loading){
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size={'large'}/>
            </View>
        )
    }

    if(!currentUser){
        return <Redirect href={'/sign-in'}/>
    }

  return (
    {children}
  )
}

export default ProtectedRoute