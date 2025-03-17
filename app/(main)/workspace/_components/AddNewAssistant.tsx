import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import AiAssistantsList from "@/services/AiAssistantsList";
import Image from "next/image";

import React, { useContext, useState } from "react";
import { ASSISTANT } from "../../ai-assistants/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AiModelOptions from "@/services/AiModelOptions";
import { Textarea } from "@/components/ui/textarea";
import AssistantAvatar from "./AssistantAvatar";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/context/AuthContext";
import { AssistantContext } from "@/context/AssistantContext";
import { Loader2Icon } from "lucide-react";

const DEFAULT_ASSISTANT = {
  image: "/default-avatar.png",
  name: "",
  title: "",
  instruction: "",
  id: 0,
  sampleQuestions: [],
  userInstruction: "",
  aiModelId: "",
}

function AddNewAssistant({ children }: any) {
  const [selectedAssistant, setSelectedAssistant] = useState<ASSISTANT>(DEFAULT_ASSISTANT);
  const AddAssistant = useMutation(api.userAiAssistants.InsertSelectedAssistantMutation);
  const {user} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const {assistant, setAssistant} = useContext(AssistantContext);

  const onHandleInputChange = (field: string, value: string) => {
    setSelectedAssistant((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSave = async()=>{
    if(!selectedAssistant?.name || !selectedAssistant?.title || !selectedAssistant?.instruction){
      return;
    }
    setLoading(true);
    const result = await AddAssistant({
      records: [selectedAssistant],
      uid: user?._id
    })
    setAssistant(null);
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Assistant</DialogTitle>
          <DialogDescription asChild>
            <div className="grid grid-cols-3 mt-5 gap-5">
              <div className="mt-5 border-r p-3">
                <Button variant={"secondary"} onClick={()=> setSelectedAssistant(DEFAULT_ASSISTANT)} size={"sm"} className="w-full">+ Create New Assistant</Button>
                <div className="mt-2">
                  {AiAssistantsList.map((assist, index) => (
                    <div
                      className="p-2 hover:bg-secondary flex gap-2 items-center rounded-xl cursor-pointer"
                      key={index}
                      onClick={() => setSelectedAssistant(assist)}
                    >
                      <Image
                        src={assist.image}
                        width={60}
                        height={60}
                        alt="assitant"
                        className="w-[35px] h-[35px] object-cover rounded-lg"
                      />
                      <h2 className="text-xs">{assist.title}</h2>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex gap-5">
                  {selectedAssistant && 
                  <AssistantAvatar selectedImage = {(v: string)=>onHandleInputChange('image', v)}>
                    <Image
                      src={selectedAssistant?.image}
                      width={150}
                      height={150}
                      alt="img"
                      className="w-[100px] h-[100px] rounded-xl cursor-pointer object-cover"
                    />
                  </AssistantAvatar>}
                  <div className="flex gap-3 flex-col w-full">
                    <Input
                      placeholder="Name of Assistant"
                      className="w-full"
                      onChange={(e) => onHandleInputChange("name", e.target.value)}
                      value={selectedAssistant?.name}
                    />
                    <Input
                      placeholder="Title of Assistant"
                      className="w-full"
                      value={selectedAssistant?.title}
                      onChange={(e) =>onHandleInputChange("title", e.target.value)}
                    />
                  </div>
                  </div>
                  <div className="mt-4">
                    <h2 className="font-semibold">Model:</h2>
                    <Select
                      defaultValue={selectedAssistant?.aiModelId}
                      onValueChange={(value) =>onHandleInputChange("aiModelId", value)}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AiModelOptions.map((model, index) => (
                          <SelectItem value={model.name} key={index}>
                            <div className="flex gap-2 items-center m-1">
                              <Image
                                src={model.logo}
                                alt={model.name}
                                width={20}
                                height={20}
                                className="rounded-md"
                              />
                              <h2>{model.name}</h2>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-5">
                    <h2 className="text-gray-500">Instruction:</h2>
                    <Textarea placeholder="Add Instructions" className="h-[200px]" value={selectedAssistant.userInstruction} onChange={(e)=> onHandleInputChange('userInstruction',e.target.value)}/>
                  </div>
                  <div className="flex gap-5 justify-end mt-10">
                    <DialogClose>
                      <Button variant={'secondary'}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={onSave} disabled={loading}> {loading && <Loader2Icon className="animate-spin"/>}Add</Button>
                  </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewAssistant;
