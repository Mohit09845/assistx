"use client";

import { AssistantContext } from "@/context/AssistantContext";
import Image from "next/image";
import React, { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AiModelOptions from "@/services/AiModelOptions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileDiff, Save, Trash } from "lucide-react";

function AssistantSettings() {
  const { assistant, setAssistant } = useContext(AssistantContext);

  const onHandleInputChnage = (field: string,value: string)=>{

  }

  return (
    assistant && (
      <div className="p-5 bg-secondary border-l-[1px] h-screen">
        <h2 className="font-bold text-xl">Settings</h2>
        <div className="mt-4 flex gap-3">
          <Image
            src={assistant?.image}
            alt="assistant"
            width={100}
            height={100}
            className="rounded-xl h-[80px] w-[80px]"
          />
          <div>
            <h2 className="font-bold">{assistant?.name}</h2>
            <p className="text-gray-700 dark:text-gray-300">
              {assistant?.title}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="font-semibold">Model:</h2>
          <Select defaultValue={assistant?.aiModelId} onValueChange={(value)=>onHandleInputChnage('aiModelId',value)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {AiModelOptions.map((model, index) => (
                <SelectItem value={model.name} key={index}>
                  <div className="flex gap-2 items-center m-1">
                    <Image src={model.logo} alt={model.name} width={20} height={20} className="rounded-md"/>
                    <h2>{model.name}</h2>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-5">
          <h2 className="text-gray-700 font-semibold">Instruction:</h2>
          <Textarea placeholder="Add Instruction" value={assistant?.userInstruction} className="h-[150px] bg-white" onChange={(e)=>onHandleInputChnage('userInstruction',e.target.value)}/>
        </div>
        <div className="absolute bottom-10 flex gap-5 right-5">
          <Button variant='ghost'><Trash/>Delete</Button>
          <Button><Save/>Save</Button>
        </div>
      </div>
    )
  );
}

export default AssistantSettings;
