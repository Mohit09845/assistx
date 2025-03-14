"use client";

import React, { useState } from 'react'
import EmptyChatState from './EmptyChatState'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

function ChatUi() {
    const [input, setInput] = useState("");
    const onSendMessage = () => {
        console.log(input);
        setInput("");
    }
  return (
    <div className='mt-20 p-6 h-[88vh]'>
        <EmptyChatState/>

        <div className='flex justify-between p-5 gap-5 absolute bottom-5 w-[58%]'>
            <Input 
            placeholder='Enter your query here...'
            onChange={(e) => setInput(e.target.value) } 
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            />
    
            <Button onClick={onSendMessage}>
                <Send/>
            </Button>
        </div>
    </div>
  )
}

export default ChatUi