"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import EmptyChatState from "./EmptyChatState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Send } from "lucide-react";
import AiModelOptions from "@/services/AiModelOptions";
import { AssistantContext } from "@/context/AssistantContext";
import axios from "axios";
import Image from "next/image";

type MESSAGE = {
  role: string;
  content: string;
};

function ChatUi() {
  const [input, setInput] = useState<string>("");
  const { assistant, setAssistant } = useContext(AssistantContext);
  const [messages, setMessages] = useState<MESSAGE[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);

  useEffect(()=>{
    if(chatRef.current){
        chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  useEffect(()=>{
    setMessages([]);
  },[assistant?.id])

  const onSendMessage = async () => {
    setLoading(true);
    setMessages((prev) => [...prev,
      {
        role: "user",
        content: input,
      },{
        role: "assistant",
        content: 'Loading...'
      }
    ]);

    const userInput = input;
    setInput("");
    const AIModel = AiModelOptions.find((item) => item.name === assistant?.aiModelId);

    const result = await axios.post("/api/eden-ai-model", {
      provider: AIModel?.edenAi,
      userInput: userInput,
    });
    setLoading(false);
    setMessages(prev => prev.slice(0,-1));
    setMessages(prev => [...prev, result.data])
  };
  return (
    <div className="mt-20 p-6 h-[88vh]">
      {messages?.length === 0 && <EmptyChatState />}

      <div ref = {chatRef} className="h-[70vh] overflow-y-scroll">
        {messages.map((msg,index)=> (
            <div key={index} className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex gap-2">
                    {msg?.role === 'assistant' && <Image src={assistant.image} alt="assistant" width={100} height={100} className="w-[30px] h-[30px] rounded-full object-cover"/>}
                    <div className={`p-2 flex gap-2 ${msg.role === 'user' ? 'bg-gray-900 text-white rounded-md' : 'bg-gray-200 text-black rounded-md'}`}>
                        {loading && messages?.length - 1 === index && <Loader2Icon className="animate-spin"/>}
                        <h2>{msg.content}</h2>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <div className="flex justify-between p-5 gap-5 absolute bottom-5 w-[58%]">
        <Input
          placeholder="Enter your query here..."
          value={input}
          disabled = {loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
        />

        <Button onClick={onSendMessage} disabled = {loading}>
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default ChatUi;
