import { useAuth } from '@/context/AuthContext';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

const _layout = () => {
  const {user, loading} = useAuth();
  const router = useRouter();
  useEffect(() => {
    if(loading) return;
    if(!loading){
      if(user && !user.user_verified){        
        router.replace('/(root)/verify-identity')
      }
      if(user && user.role === "PASSENGER"){
        router.replace('/(root)/client/section/client-home')
      }else if(user && user.role === 'DRIVER'){
        router.replace('/(root)/driver/section/active-routes')
      }
    }
  }, [user, loading])
  
  return (
    <Stack screenOptions={{headerShown: false, gestureEnabled: false}}/>
  )
}

export default _layout