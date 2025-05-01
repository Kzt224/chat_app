import {BrowserRouter as Router,Route,Routes,Navigate} from "react-router-dom"
import {useAuthStore} from "./store/useAuthStore.js";
import {Toaster,toast} from "react-hot-toast";
import { Loader } from "lucide-react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import {  useEffect } from "react";
import { useThemeStore } from "./store/useThemeStore.js";

export default function App()
{

  const {checkAuth,isCheckingAuth,authUser,onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();


  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
        set({ authUser: JSON.parse(storedUser) });
    }
    checkAuth(); // Now, run checkAuth AFTER restoring user data
}, []);

  if(isCheckingAuth && !authUser)
  {
    return (
      <div className="flex justify-center items-center h-screen">
         <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return(
        <div data-theme={theme}>
             <Router>
        <Navbar/>
            <Routes>
              <Route path="/" element={ authUser ? <HomePage/> : <Navigate to="/login"/>}/>
              <Route path="/signup" element={ !authUser ? <SignupPage/> : <Navigate to="/"/>}/>
              <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
              <Route path="/setting" element={ authUser ? <SettingPage/> : <Navigate to="/login"/>}/>
              <Route path="/profile" element={ authUser ? <ProfilePage/> : <Navigate to="/login"/> }/>
            </Routes>
        </Router>
        <Toaster/>
        </div>
  );
}