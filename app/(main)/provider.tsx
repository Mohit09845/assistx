"use client"

import React, { useEffect } from 'react'
import Header from './_components/Header'
import { getAuthUserData } from '@/services/GlobalApi'
import { useRouter } from 'next/navigation';

function Provider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  useEffect(()=>{
    CheckUserAuth()
  },[])

  const CheckUserAuth = async() => {
    const token = localStorage.getItem('user_token')
    // Get New Access token
    const user = token && await getAuthUserData(token);

    if(!user?.email){
      router.replace('/sign-in');
      return;
    }
    // Get user into from database
    try {
      
    } catch (error) {
      
    }
  }
  return (
    <div>
      <Header/>
      {children}
    </div>
  )
}

export default Provider