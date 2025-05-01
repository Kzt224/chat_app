import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

export default function ProfilePage()
{
    const {authUser,updateProfile,isUpdatingProfile} = useAuthStore();
    const [selectedImage,setSelectedImage] = useState(null);
   
    const handleImageUpload = (e) => {
       const file = e.target.files[0];
       if(!file) return ;
       const reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload= async() => {
           const base64Image = reader.result;
           setSelectedImage(base64Image);
           await updateProfile({profilePic: base64Image});
       }
    }

    return(
        <div className="h-screen pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8 ">
              <div className="bg-base-300 rounded-xl p-6 space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold">Profile</h1>
                    <p className="mt-2">Your profile information</p>
                </div>
                {/* profile avarter */}
                 <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <img src={selectedImage || authUser.profilePic || "/public/avatar.png"} alt="profile picture" 
                      className="size-32 rounded-full object-cover border-4"/>
                       <label htmlFor="upload-profile"
                        className={`absolute bottom-0 right-0 bg-base-content hover:scale-105
                            p-2 rounded-full cursor-pointer transition-all duration-200
                            ${isUpdatingProfile ?  "animate-pulse pointer-events-none" : ""}`}
                       >
                         <Camera className="w-5 h-5 text-base-200"/>
                         <input type="file"
                         id="upload-profile"
                         className="hidden" 
                         accept="image/*"
                         onChange={handleImageUpload}
                         disabled={isUpdatingProfile}
                         />
                       </label>
                    </div>
                    <p className="text-zinc-400 text-sm">
                        {isUpdatingProfile ? "Updating profile picture..." : "Click on the camera icon to upload profile picture"}
                    </p>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-1.5">
                      <div className="text-sm tex-zinc-400 items-center flex gap-2">
                        <User className="w-6 h-6"/>
                          <span>Full Name</span>
                      </div>
                       <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-sm tex-zinc-400 flex items-center gap-2">
                        <Mail className="w-6 h-6"/>
                          <span>Email</span>
                      </div>
                       <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                    </div>
                 </div>
                 <div className="mt-6 bg-base-300 rounded-xl p-6">
                    <h2 className="text-lg font-medium">Account Information</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                        <span >Member Since</span>
                        <span>{authUser.createdAt?.split("T")[0]}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span>Account Status</span>
                        <span className="text-green-600">Active</span>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
        </div>
    );
}