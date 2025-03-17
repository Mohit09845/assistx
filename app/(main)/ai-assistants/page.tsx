"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/convex/_generated/api";
import AiAssistantsList from "@/services/AiAssistantsList";
import { useConvex, useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export type ASSISTANT = {
  id: number;
  name: string;
  title: string;
  image: string;
  instruction: string;
  userInstruction: string;
  sampleQuestions: string[];
  aiModelId?: string;
};

function AIAssistants() {
  const [selectedAssistant, setSelectedAssistant] = useState<ASSISTANT[]>([]);
  const insertAssistant = useMutation(api.userAiAssistants.InsertSelectedAssistantMutation);
  const {user} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const convex = useConvex();
  const router = useRouter();

  useEffect(()=>{
    user && GetUserAssistants()
  },[user])

  const GetUserAssistants = async()=>{
    const result = await convex.query(api.userAiAssistants.GetAllUserAssistants, {
      uid: user._id
    });
    if(result.length > 0){
      router.replace('/workspace')
      return;
    }
  }

  // Toggle selection
  const onSelect = (assistant: ASSISTANT) => {
    setSelectedAssistant((prev) =>
      prev.some((item) => item.id === assistant.id)
        ? prev.filter((item) => item.id !== assistant.id) // Remove if selected
        : [...prev, assistant] // Add if not selected
    );
  };

  // Check if assistant is selected
  const isAssistantSelected = (assistant: ASSISTANT) =>
    selectedAssistant.some((item) => item.id === assistant.id);

  const onClickContinue = async () => {

    if (!user?._id) {
      return;
    }
  
    setLoading(true);
  
    try {
      const result = await insertAssistant({
        records: selectedAssistant,
        uid: user._id,  
      });
      
      if (result) {
        router.replace("/workspace");
      }
    } catch (error) {
      console.error("Error inserting assistant:", error);
    }
  
    setLoading(false);
  };
  

  return (
    <div className="px-10 mt-20 md:px-28 lg:px-36 xl:px-48">
      <div className="flex justify-between items-center">
        <div>
          <BlurFade delay={0.25} inView>
            <h2 className="text-3xl font-bold">
              Welcome to the world of AI Assistants 🤖
            </h2>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <p className="text-xl mt-2">
              Choose your AI Companion to simplify your Task 🚀
            </p>
          </BlurFade>
        </div>

        {/* Button is disabled when no assistant is selected */}
        <ShimmerButton
          disabled={selectedAssistant.length === 0 || loading}
          className={`shadow-2xl ${
            selectedAssistant.length === 0
              ? "opacity-50 cursor-not-allowed" // Styling for disabled state
              : ""
          }`} onClick={onClickContinue}
        >
          <span>{loading && <Loader2 className="h-4 w-4 animate-spin"/>}</span>
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
            Continue
          </span>
        </ShimmerButton>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
        {AiAssistantsList.map((assistant) => (
          <BlurFade
            key={assistant.id}
            delay={0.25 * assistant.id * 0.05}
            inView
          >
            <div
              key={assistant.id}
              className={`hover:border p-3 rounded-xl hover:scale-105 transition-all ease-in-out cursor-pointer relative ${
                isAssistantSelected(assistant) ? "border-blue-500" : ""
              }`}
            >
              <Checkbox
                className="absolute m-2"
                checked={isAssistantSelected(assistant)}
                onCheckedChange={() => onSelect(assistant)}
              />
              <Image
                src={assistant.image}
                alt={assistant.title}
                width={600}
                height={600}
                className="rounded-xl w-full h-[200px] object-cover"
              />
              <h2 className="text-center font-bold text-lg">{assistant.name}</h2>
              <h2 className="text-center text-gray-600 dark:text-gray-300">
                {assistant.title}
              </h2>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default AIAssistants;
