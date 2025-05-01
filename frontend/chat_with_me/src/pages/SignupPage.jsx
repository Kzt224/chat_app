import {User, MessageSquare, Mail, Lock, EyeOff, Eye, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { useState } from "react";
import toast from "react-hot-toast";


export default function SignupPage()
{
    const [showPassword,setShowPassword] = useState(false);
    const [FormData,setFormData] = useState({
        fullName:"",
        email:"",
        password: "",
    });
    const {signUp,isSigningUp} = useAuthStore();    
    const validateForm = () => {
          if(!FormData.fullName.trim()) return toast.error("Full name is required");
          if(!FormData.email.trim()) return toast.error("Email is required");
          if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(FormData.email)) return toast.error("Invalid email format");
          if(!FormData.password.trim()) return toast.error("password is required");
          if(FormData.password.length < 8) return toast.error("Password must be at least 8 characters");
          return(true);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const status = validateForm(FormData);
        if(status === true) signUp(FormData);
        }
    return(
        <div className="grid lg:grid-cols-2 mt-2 min-h-screen">
            {/* left side */}
        <div className="p-6 sm:p-12 items-center justify-center flex flex-col ">
            <div className="w-full max-w-md space-y-8">
                {/* logo section */}
               <div className="text-center mb-8">
                  <div className="flex flex-col items-center gap-2 group">
                     <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center p-3 group-hover:bg-primary/20 transition-colors">
                        <MessageSquare className="size-6 text-primary"/>
                     </div>
                     <h1 className="text-2xl mt-2">Create Account</h1>
                     <p className="text-base-content/60">Get start with your free account</p>
                  </div>
               </div>
               {/* form section */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                        <label htmlFor="fullname"className="label pb-2">
                            <span className="label-text font-medium">Full Name</span>
                        </label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="size-5 text-base-content/40"/>
                           </div>
                           <input type="text"
                            id="fullname"
                             className={`input input-bordered w-full pl-10`}
                             placeholder="John Doe"
                             value={FormData.fullName}
                             onChange={(e) => setFormData({...FormData,fullName:e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-control">
                        <label htmlFor="email"className="label pb-2">
                            <span className="label-text font-medium">Email</span>
                        </label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="size-5 text-base-content/40"/>
                           </div>
                           <input type="email"
                             id="email"
                             className={`input input-bordered w-full pl-10`}
                             placeholder="John@gmail.com"
                             value={FormData.email}
                             onChange={(e) => setFormData({...FormData,email:e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-control">
                        <label htmlFor="fullname"className="label pb-2">
                            <span className="label-text font-medium">Password</span>
                        </label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="size-5 text-base-content/40"/>
                           </div>
                           <input type={showPassword ? "text" : "password"}
                            id="password"
                             className={`input input-bordered w-full pl-10`}
                             placeholder="********"
                             value={FormData.password}
                             onChange={(e) => setFormData({...FormData,password:e.target.value})}
                            />
                            <button type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? 
                                <Eye className="size-5 text-base-content/40"/> : 
                                <EyeOff className="size-5 text-base-content/40"/>}
                            </button>
                        </div>
                    </div>
                        <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                            {isSigningUp ? (
                                <>
                                  <Loader2 className="size-5 animate-spin"/>
                                   Loading...
                                </>
                            ):(
                                "Create Account"
                            )}
                        </button>
                        <div className="text-center">
                          <p className="text-base-content/60">
                             Already have an account?
                             <a href="/login" className="link link-primary">Sign In</a>
                          </p>
                        </div>
                </form>
            </div>
        </div>
        <div className="p-6 sm:p-12 items-center justify-center flex flex-col">
             <AuthImagePattern
               title={"Welcome Back"}
               subtitle={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
             />
            </div>

        </div>

    );
}