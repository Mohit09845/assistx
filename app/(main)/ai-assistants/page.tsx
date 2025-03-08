"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import AiAssistantsList from "@/services/AiAssistantsList";
import Image from "next/image";
import React, { useState } from "react";

export type ASSISTANT = {
    id: number,
    name: string,
    title: string,
    image: string,
    instruction: string,
    userInstruction: string,
    sampleQuestions: string[]
}

function AIAssistants() {
  const [selectedAssistant, setSelectedAssistant] = useState<ASSISTANT[]>([]);

  const onSelect = (assistant: ASSISTANT)=>{
    const item = selectedAssistant.find((item: ASSISTANT)=>item.id == assistant.id);
    if(item){
      selectedAssistant.filter((item: ASSISTANT) => item.id !== assistant.id)
      return;
    }
    setSelectedAssistant(prev => [...prev, assistant])
  }

  const isAssistantSelected = (assistant: ASSISTANT) => {
    const item = selectedAssistant.find((item: ASSISTANT)=>item.id == assistant.id);

    return item ? true : false
  }

  return (
    <div className="px-10 mt-20 md:px-28 lg:px-36 xl:px-48">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Welcome to the world of AI Assistants 🤖</h2>
          <p className="text-xl mt-2">Choose your AI Companion to simplify your Task 🚀</p>
        </div>
      <Button>Continue</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
      {AiAssistantsList.map((assitant,index) => (
        <div key={index} className="hover:border p-3 rounded-xl hover:scale-105 transition-all ease-in-out cursor-pointer relative" onClick={()=>onSelect(assitant)}>
          <Checkbox className="absolute m-2" checked = {isAssistantSelected(assitant)}/>
          <Image src={assitant.image} alt = {assitant.title} width={600} height={600} className="rounded-xl w-full h-[200px] object-cover"/>
          <h2 className="text-center font-bold text-lg">{assitant.name}</h2>
          <h2 className="text-center text-gray-600 dark:text-gray-300">{assitant.title}</h2>
        </div>
      ))}
    </div>

    </div>
  );
}

export default AIAssistants;
