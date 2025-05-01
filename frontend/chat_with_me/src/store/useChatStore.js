import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import {toast} from "react-hot-toast";
import {useAuthStore} from "./useAuthStore";

export const useChatStore = create((set,get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading:false,

    getUsers : async() => {
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users",{
                withCredentials: true,
            });
            set({users: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading: false});
        }
    },
    getMessages : async(userId) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`,{
                withCredentials: true,
            });
            set({messages: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading: false});
        }
    },
    sentMessage: async (messageData)=> {
        const {selectedUser,messages} = get();
      try {
         const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData,{
            withCredentials: true,
         });
         set({messages: [...messages,res.data]});
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
    subscribeMessage: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        
        socket.on("newMessage",(newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            set({messages: [...get().messages,newMessage],})
        });
    },
    unsubscribeMessage:() => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (selectedUser) => set({selectedUser})    
}))