import { Outlet } from 'react-router-dom';
import logo from "@/assets/images/logo.png";
import {
  Search,
  Bell,
  MapPin,
  ChevronRight,
  Clock,
  Star,
  Home,
  Briefcase,
  Heart,
  User,
  Anchor,
  Sparkles,
  Calendar,
  Award,
  Ticket,
  Car,
  Lightbulb,
  X,
  ArrowRight,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect} from 'react'
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import DesktopNavbar from '../../pages/User/Home/components/DesktopNavbar/DesktopNavbar'

export default function MasterLayout() {
  const navigate = useNavigate();
 
  const { pathname } = useLocation();
  const [activeTab,setActiveTab] = useState('')
  
  // const handleNavigate = (page)=>{
  //   navigate(page)
  // }
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 992
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);
  
  useEffect(() => {
    // Fetch/load new content whenever the route changes
    setActiveTab(pathname.split("/").filter(Boolean).pop())
    console.log("New route:", activeTab);
  }, [location.pathname]);
  return (
    <div className="g">
      {isMobile? activeTab === 'profile'?<></>:<Header/> :<DesktopNavbar/> }
      <Outlet />
      {activeTab === 'profile' || isMobile == false? <></>:<Navbar/>}
    </div>
);
}

function Header(){
  const { profile } = useSelector((state) => state.auth || {});
  const notifications = useSelector((state) => state.notifications?.notifications || []);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return (
    <div className="bg-white sticky top-0 z-40 px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/user/home")}>
          <img src={logo} alt="Nefru Logo" className="h-[38px] w-auto" />
          <span 
            className="font-semibold text-[#003D5B]" 
            style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.1rem' }}
          >
            Nefru
          </span>
        </div>
        <button
          onClick={() => navigate("/user/notifications")}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 rounded-circle hover:bg-gray-200 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>
      </div>
  )
}

function Navbar(){
  const navigate = useNavigate();
 
  const { pathname } = useLocation();
  const [activeTab,setActiveTab] = useState('')
  useEffect(() => {
    setActiveTab(pathname.split("/").filter(Boolean).pop())
    console.log("New route:", activeTab);
  }, [location.pathname]);

  return(
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => navigate("/user/home")}
          className={`flex flex-col items-center gap-1 text-xs font-bold ${activeTab === 'home'?"text-[#003D5B]":"font-semibold text-gray-400 hover:text-gray-700"} `}
        >
          <Home className={`w-5 h-5  ${activeTab === 'home'? "stroke-[2.4]":""}`} />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigate("/user/trips")}
          className={`flex flex-col items-center gap-1 text-xs font-bold ${activeTab === 'trips'?"text-[#003D5B]":"font-semibold text-gray-400 hover:text-gray-700"} `}
          
        >
          <Briefcase className={`w-5 h-5  ${activeTab === 'trips'? "stroke-[2.4]":""}`} />
          <span>Trips</span>
        </button>

        <button
          onClick={() => navigate("/user/saved")}
          className={`flex flex-col items-center gap-1 text-xs font-bold ${activeTab === 'saved'?"text-[#003D5B]":"font-semibold text-gray-400 hover:text-gray-700"} `}

        >
          <Heart className={`w-5 h-5  ${activeTab === 'saved'? "stroke-[2.4]":""}`} />
          <span>Saved</span>
        </button>

        <button
          onClick={() => navigate("/user/profile")}
          className={`flex flex-col items-center gap-1 text-xs font-bold ${activeTab === 'profile'?"text-[#003D5B]":"font-semibold text-gray-400 hover:text-gray-700"} `}
        >
          <User className={`w-5 h-5  ${activeTab === 'profile'? "stroke-[2.4]":""}`} />
          <span>Profile</span>
        </button>
      </nav>
  )
}