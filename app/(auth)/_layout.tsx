import { useAuth } from '@/context/AuthContext';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

const _layout = () => {
  const {currentUser, loading} = useAuth();
  const router = useRouter();
  useEffect(() => {
    if(loading) return;
    if(!loading){
      if(currentUser && !currentUser.emailVerified){        
        return;
      }
      if(currentUser && currentUser.role === 'client'){
        router.replace('/(root)/client/section/client-home')
      }else if(currentUser && currentUser.role === 'driver'){
        router.replace('/(root)/driver/section/active-routes')
      }
    }
  }, [currentUser, loading])
  
  return (
    <Stack screenOptions={{headerShown: false}}/>
  )
}

export default _layout