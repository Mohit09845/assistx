"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ASSISTANT } from "../../ai-assistants/page";
import Image from "next/image";
import { AssistantContext } from "@/context/AssistantContext";
import { BlurFade } from "@/components/magicui/blur-fade";
import AddNewAssistant from "./AddNewAssistant";

function AssistantList() {
  const { user } = useContext(AuthContext);
  const convex = useConvex();
  const [assistantList, setAssistantList] = useState<ASSISTANT[]>([]);
  const { assistant, setAssistant } = useContext(AssistantContext);

  useEffect(() => {
    user && GetUserAssistants();
  }, [user && assistant === null]);

  const GetUserAssistants = async () => {
    const result = await convex.query(
      api.userAiAssistants.GetAllUserAssistants,
      { uid: user._id }
    );
    setAssistantList(result);
  };

  return (
    <div className="p-5 bg-gray-100 dark:bg-gray-800 border-r h-screen flex flex-col">
      {/* Header */}
      <h2 className="font-bold text-black dark:text-white text-lg">
        Your Personal AI Assistants
      </h2>
      <AddNewAssistant>
        <Button className="w-full mt-3">+ Add New Assistant</Button>
      </AddNewAssistant>
      <Input
        className="bg-white dark:bg-gray-700 mt-3 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        placeholder="Search"
      />

      {/* Assistants List - Make it Scrollable */}
      <div className="mt-5 overflow-y-auto flex-1">
        {assistantList.map((assist) => (
          <BlurFade key={assist.id} delay={0.25 * assist.id * 0.05} inView>
            <div
              className={`p-3 flex gap-3 items-center hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer rounded-xl mt-2 ${
                assist.id === assistant?.id ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
              onClick={() => setAssistant(assist)}
            >
              <Image
                src={assist.image}
                alt={assist.name}
                height={60}
                width={60}
                className="rounded-xl w-[60px] h-[60px] object-cover"
              />
              <div>
                <h2 className="font-bold text-black dark:text-white">{assist.name}</h2>
                <h2 className="text-gray-700 dark:text-gray-300 text-sm">{assist.title}</h2>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>

      <div className="mt-auto flex gap-3 items-center hover:bg-gray-200 dark:hover:bg-gray-700 w-full p-2 rounded-xl cursor-pointer">
        {user?.picture ? (
          <Image
            src={user.picture}
            alt="user"
            width={35}
            height={35}
            className="rounded-full"
          />
        ) : (
          <Image
            src="/default-avatar.png"
            alt="default user"
            width={35}
            height={35}
            className="rounded-full"
          />
        )}
        <div>
          <h2 className="font-bold">{user?.name}</h2>
          <h2 className="text-gray-400 text-sm">{user?.orderID ? "Pro Plan" : "Free Plan"}</h2>
        </div>
      </div>
    </div>
  );
}

export default AssistantList;