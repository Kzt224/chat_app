import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudnary from "../lib/cloudinary.js";

//signup route
/**
 * 
 * @param {fullName,email,password} req 
 * @param {*user} res 
 * @returns 
 */
export const signup = async (req,res) => {
    const {fullName,email,password} = req.body;
   try {
      if(!fullName || !email){
        return res.status(400).json({message: "Require email and fullname"});
      }
      if(password.length < 8){
          return res.status(400).json({message: 'Password must be at least 8 character'});
      }

      const user = await User.findOne({email});

      if(user) return res.status(400).json({message: "Email already exit"});
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password,salt);

      const newUser = new User({
        fullName,
        email,
        password: hashPassword,
      });

      if(newUser){
        
       generateToken(newUser._id,res);
       await newUser.save();

       res.status(201).json({
         _id:newUser.id,
         fullName: newUser.fullName,
         email: newUser.email,
         profilePic: newUser.profilePic,
       }
    );
      }else{
        return res.status(400).json({message: "Invalid user Data"});
      }
   } catch (error) {
      console.log('Error in sign up controller',error.message);
      res.status(500).json({message: "inter server error"});
   }
};

//login route
/**
 * 
 * @param {email,password} req 
 * @param {*user} res 
 * @returns 
 */
export const login = async (req,res) => {
     const{email,password} = req.body;

     try {
         const user = await User.findOne({email});
         if(!user){
            return res.status(400).json({message: "Incorrect credential"});
         }
         const isPasswordIncorrect = await bcrypt.compare(password,user.password);
         if(!isPasswordIncorrect){
            return res.status(400).json({message: "Incorrect password"});
         }
         generateToken(user._id,res);
         res.status(200).json({
           fullName: user.fullName,
           email:  user.email,
           profilePic : user.profilePic,
         });

     } catch (error) {
       console.log("Error in login controller",error.message);
       res.status(500).json({message: "Internal server error"})
     }
};

//logout route
export const logout = (req,res) => {
     try {
        res.cookie("jwt","",{
          maxAge: 0,
        });
        res.status(200).json({message: "Logout successfully!"});
     } catch (error) {
       console.log("Error on logout controller",error.message);
       res.status(500).json({message: "internal server error"});
     }
};

//update profile picture
/**
 * 
 * @param {profilePic} req 
 * @param {*updatedUser} res 
 * @returns 
 */
export const updateProfile = async (req,res) => {
   
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
           return res.status(400).json({message: "Profile picture is required"});
        }

        const uploadResponse = await cloudnary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {profilePic: uploadResponse.secure_url},
          {new: true},
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error on update profile photo route",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

//chacking user is auth or not
/**
 * 
 * @param {*user} req 
 * @param {*user} res 
 */
export const checkAuth = (req,res) => {
  try {
      res.status(200).json(req.user);
  } catch (error) {
    console.log('Error on auth check route',error.message);
    res.status(400).json({message: "Internal server error"});
  }
};