"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { getAuthUserData } from '@/services/GlobalApi';

function SignIn() {
    
    
const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if(typeof window !== undefined){
        localStorage.setItem('user_token', tokenResponse.access_token);
      }
      const user = getAuthUserData(tokenResponse.access_token);
  
      console.log(user);
    },
    onError: errorResponse => console.log(errorResponse),
  });
    
  return (
    <div className='flex items-center justify-center h-screen'>
    <div className='flex flex-col items-center gap-5 border rounded-2xl p-10 shadow-md'>
        <Image src={'/logo.svg'} alt='logo.svg' width={100} height={100}/> 
        <h2 className='text-2xl'>Sign In to your personalized AI assistant</h2>
        <Button onClick={()=>googleLogin()}>Sign In with Gmail</Button> 
    </div>
    </div>
  )
}

export default SignIn


// nextjs automatically undesrtands we are trying to access assets from public folder