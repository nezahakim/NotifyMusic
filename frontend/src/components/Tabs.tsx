import { Home, People, Profile, Search } from "@/utils/icons";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';


const MenuTabs = () => {
   
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState(pathname?.split('/').pop() || 'home')

    const [participantCount, setParticipantCount] = useState(0);
        
        // Get the current active tab from the pathname
        const serverUrl = 'http://localhost:3001'
        
        useEffect(()=>{
            const socket = io(serverUrl, {
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                autoConnect: true,
                withCredentials: true,
                transports: ['websocket', 'polling']
              });
        
            const roomId = "acoustic-night-1";
            
            socket.on('connect', ()=>{
                console.log("connected to Server")
            
                socket.emit('get-live-participants', roomId, (responce:{success: boolean, participants:number})=>{
                    if(responce && responce.success){
                        setParticipantCount(responce.participants)
                    }
                })
            })
        },[])
    

    const tabs = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'search', icon: Search, label: 'Search' },
        { id: 'live', icon: People, label: 'Live', badge: `${participantCount}` },
        { id: 'profile', icon: Profile, label: 'Profile' }
    ];

    return (
        <div className="flex justify-around items-center px-2 py-2 bg-white/60 backdrop-blur-xl">
            {tabs.map((tab) => (
                <Link
                    href={tab.id}
                    key={tab.id}
                    className="flex flex-col items-center gap-1 min-w-[56px] relative"
                    onClick={() => setActiveTab(tab.id)}
                >
                    <div className="relative">
                        <tab.icon 
                            className={`w-5 h-5 ${
                                activeTab === tab.id ? 'text-gray-900' : 'text-gray-400'
                            }`} 
                        />
                        {tab.badge && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                                <span className="text-[10px] font-bold text-white">{tab.badge}</span>
                            </div>
                        )}
                    </div>
                    <span className={`text-[10px] font-medium ${
                        activeTab === tab.id ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                        {tab.label}
                    </span>
                </Link>
            ))}
        </div>
    );
};

export default MenuTabs;