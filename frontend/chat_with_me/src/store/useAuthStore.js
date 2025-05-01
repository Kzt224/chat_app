import { create } from "zustand";
import {axiosInstance} from "../libs/axios.js";
import toast from "react-hot-toast";
import {encodedData,decodeData} from "../libs/encrypt.js";
import {io} from "socket.io-client";

const BASE_URL = "http://localhost:5000";

export const useAuthStore = create((set,get) => ({
    authUser: decodeData(localStorage.getItem("user_data")) || null,
    isLoggingIn: false,
    isSiggningUp: false,
    isUpdatingProfile: false,
    isCheckingAUth: true,
    onlineUsers : [],
    socket : null,


    checkAuth: async() => {

        try {
            const res = await axiosInstance.get("/auth/check",{
                withCredentials: true,
            });
            // //encrypt and store user data to browse localstorage
            // const userData = encodedData(res.data);
            //  localStorage.setItem("user_data",userData);
             set({authUser: res.data});
             get().connectSocket();
        } catch (error) {
            console.log("error on check Auth",error.message);
            set({authUser:null});
        }finally{
            set({isCheckingAUth: false});
        }
    },
    signUp: async(data) => {
        set({isSiggningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            toast.success("Account created successfully!");
            get().connectSocket();
            set({authUser: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isSiggningUp: false});
        }
    },
    logOut: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully!");
            localStorage.removeItem("user_data");
            get().socket.disconnect();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    login: async(data) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            toast.success("Login successfully!");
            //set to browse storage with encrypted data
            const userData =encodedData(res.data);
            localStorage.setItem("user_data",userData);
            set({authUser: res.data});
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn: false});
        }
    },
    updateProfile: async(data) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            toast.success("Profile picture uploaded successfully!");
            set({authUser: res.data});
        } catch (error) {
            console.log("error on upload profile",error.message);
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile: false});
        }
    },
    connectSocket:() => {
       const {authUser} = get();
       if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query: {
                userId: authUser?._id
            }
        })
        socket.connect();

        set({socket: socket});
        socket.on("getOnlineUsers",(userIds) => {
            set({onlineUsers: userIds});
        })
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    }

}))