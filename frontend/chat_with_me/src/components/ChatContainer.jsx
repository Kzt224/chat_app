import { useEffect,useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleron";
import { useAuthStore } from "../store/useAuthStore";
import { formatTime } from "../libs/utils";


export default function ChatContainer()
{
     const {messages,getMessages,isMessageLoading,selectedUser,subscribeMessage,unsubscribeMessage} = useChatStore();
     const {authUser} = useAuthStore();
     const messageEndRef = useRef(null);

     useEffect(() => {
       getMessages(selectedUser._id);

       subscribeMessage();

       return () => unsubscribeMessage();

     },[selectedUser._id,getMessages,subscribeMessage,unsubscribeMessage]);

     useEffect(() => {
       if(messageEndRef.current && messages){
         messageEndRef.current.scrollIntoView({behavior: "smooth"});
       }
     },[messages])

     if(isMessageLoading){
        return(
            <div className=" flex-1 flex flex-col overflow-auto">
              <ChatHeader/>
              <MessageSkeleton/>
              <MessageInput/>
            </div>
        );
     }
    return(
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat ${message.senderId === authUser._id ? "chat-end" : " chat-start"}`}
                    ref={messageEndRef}
                    >
                      <div className="chat-image avatar">
                        <div className="size-10 rounded-full border">
                          <img src={
                            message.senderId === authUser._id ?
                             authUser.profilePic || "/avatar.png" :
                              selectedUser.profilePic || "/avatar.png"} alt="profile" />
                        </div>
                      </div>
                       <div className="chat-header mb-1">
                          <time className="text-xs opacity-50 ml-1"/>
                            {formatTime(message.createdAt)}
                       </div>
                       <div className="chat-bubble flex flex-col">
                          {message.image && (
                            <img 
                               src={message.image}
                               alt="Attachment"
                               className="sm:max-w-[200px] rounded-md mb-2 flex"
                            />
                          )}
                           {message.text && <p>{message.text}</p>}
                       </div>
                  </div>
                 ))}
              </div>
            <MessageInput/>
        </div>
    );
}