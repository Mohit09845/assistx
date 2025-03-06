"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useContext } from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import { getAuthUserData } from '@/services/GlobalApi';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

function SignIn() {
    
const CreateUser = useMutation(api.users.CreateUser);
const {user,setUser} = useContext(AuthContext);

const router = useRouter()

const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if(typeof window !== undefined){
        localStorage.setItem('user_token', tokenResponse.access_token);
      }
      const user = await getAuthUserData(tokenResponse.access_token);
  
      // we pass user info through this auth to createUser mutation
      const result = await CreateUser({
        name: user?.name,
        email:user?.email,
        picture:user?.picture
      })

      setUser(result);
      router.replace('/ai-assistants')
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