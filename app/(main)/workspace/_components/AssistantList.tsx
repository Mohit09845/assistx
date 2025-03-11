"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ASSISTANT } from "../../ai-assistants/page";
import Image from "next/image";

function AssistantList() {
  const { user } = useContext(AuthContext);
  const convex = useConvex();
  const [assistantList, setAssistantList] = useState<ASSISTANT[]>([]);

  useEffect(() => {
    if (user) GetUserAssistants();
  }, [user]);

  const GetUserAssistants = async () => {
    const result = await convex.query(
      api.userAiAssistants.GetAllUserAssistants,
      { uid: user._id }
    );
    console.log(result);
    setAssistantList(result);
  };

  return (
    <div className="p-5 bg-gray-100 dark:bg-gray-900 border-r h-screen">
      <h2 className="font-bold text-black dark:text-white text-lg">
        Your Personal AI Assistants
      </h2>
      <Button className="w-full mt-3">+ Add New Assistant</Button>
      <Input
        className="bg-white dark:bg-gray-800 mt-3 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        placeholder="Search"
      />

      <div className="mt-5">
        {assistantList.map((assistant, index) => (
          <div
            key={index}
            className="p-3 flex gap-3 items-center hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl"
          >
            <Image
              src={assistant.image}
              alt={assistant.name}
              height={60}
              width={60}
              className="rounded-xl w-[60px] h-[60px] object-cover"
            />
            <div>
              <h2 className="font-bold text-black dark:text-white">
                {assistant.name}
              </h2>
              <h2 className="text-gray-700 dark:text-gray-300 text-sm">
                {assistant.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssistantList;
