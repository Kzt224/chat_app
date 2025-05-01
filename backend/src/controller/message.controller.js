import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


/**
 * 
 * @param {req.user._id} req 
 * @param {*users} res 
 */
export const getUserForSidebar = async(req,res) => {
     try {
        const loginUserId = req.user._id;
        const filteredUsers = await User.find({
            _id: {
                $ne: loginUserId,
            }
        }).select("-password");

        res.status(200).json(filteredUsers);
     } catch (error) {
        console.log("Error on get user sidebar route",error.message);
        res.status(500).json({message: "Internal server error"});
     }
}

/**
 * 
 * @param {senderId,receiverId} req 
 * @param {*messages} res 
 */
export const getMessagebyUser = async (req,res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId,receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ]
        });
        res.status(200).json(messages);

    } catch (error) {
        console.log('error on getMessagebyUser',error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

/**
 * send message route function
 * @param {receiverId,senderId,text,image} req 
 * @param {*newMessage} res 
 */
export const sendMessage = async (req,res) => {
    try {
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        const {text,image} = req.body;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
             imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        }) ;
        await newMessage.save();

        //here real time message section using websocket io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log('Error on senMessage route',error.message);
        res.status(500).json({message: "Internal server error"});
    }
};