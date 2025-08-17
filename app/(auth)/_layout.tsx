import { useAuth } from '@/context/AuthContext';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

const _layout = () => {
  const {currentUser, loading, role} = useAuth();
  const router = useRouter();
  useEffect(() => {
    if(!loading){
      if(currentUser && role === 'client'){
        router.replace('/(root)/client/section/client-home')
      }else if(currentUser && role === 'driver'){
        router.replace('/(root)/driver/section/active-routes')
      }
    }
  }, [currentUser, loading, role])
  
  return (
    <Stack screenOptions={{headerShown: false}}/>
  )
}

export default _layout