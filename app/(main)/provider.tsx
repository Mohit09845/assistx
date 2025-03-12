"use client"

import React, { useContext, useEffect, useState } from 'react'
import Header from './_components/Header'
import { getAuthUserData } from '@/services/GlobalApi'
import { useRouter } from 'next/navigation';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AuthContext } from '@/context/AuthContext';
import { AssistantContext } from '@/context/AssistantContext';

function Provider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const convex = useConvex();
  const {user, setUser} = useContext(AuthContext);
  const [assistant, setAssistant] = useState();

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
      const result = await convex.query(api.users.GetUser,{
        email: user?.email
      })
      setUser(result);
    } catch (error) {
      return error;
    }
  }
  return (
    <div>
      <AssistantContext.Provider value={{assistant, setAssistant}}>
      <Header/>
      {children}
      </AssistantContext.Provider>
    </div>
  )
}

export default Provider