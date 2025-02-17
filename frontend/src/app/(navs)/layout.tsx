// "use client"
// import Image from "next/image";
// import Header from '@/components/Header';
// import MenuTabs from '@/components/Tabs';
// import { useAudioPlayer } from "@/context/AudioContext";

// export default function RootLayout({
//     children,}: Readonly<{
//         children: React.ReactNode;
// }>){

// const player = useAudioPlayer()

    
// return( <div className="h-screen flex flex-col">
//     {/* Header - Fixed Height */}
//     <Header />
    
//     {/* Main Content - Flexible Height */}
//     <main className="flex-1 min-h-0">
//         {children}
//     </main>
    
//     {/* Footer - Fixed Height */}
//     <footer className="backdrop-blur-xl">
//         {/* <div className="w-full h-0.5 bg-gray-100">
//             <div className="w-1/3 h-full bg-gray-900"></div>
//         </div> */}
//         <MenuTabs />
//     </footer>
    
//     {/* Background Image */}
//     {player?.currentTrack !== null && player.currentTrack.thumbnail !== undefined ? (<Image 
//         className="fixed -inset-0 -z-50 blur-xl opacity-40" 
//         src={player.currentTrack.thumbnail} 
//         alt="cover" 
//         layout="fill" 
//         objectFit="cover"
//         priority
//     />): ''}
// </div>)
// }

"use client"
import Image from "next/image";
import Header from '@/components/Header';
import MenuTabs from '@/components/Tabs';
import { useAudioPlayer } from "@/context/AudioContext";

export default function RootLayout({
    children,}: Readonly<{
        children: React.ReactNode;
}>){

const player = useAudioPlayer();

// Ensure `player?.currentTrack` exists before accessing `thumbnail`
const backgroundImage = player?.currentTrack?.thumbnail ? (
    <Image 
        className="fixed -inset-0 -z-50 blur-xl opacity-40" 
        src={player.currentTrack.thumbnail} 
        alt="cover" 
        layout="fill" 
        objectFit="cover"
        priority
    />
) : null;

return ( 
    <div className="h-screen flex flex-col">
        {/* Header - Fixed Height */}
        <Header />
        
        {/* Main Content - Flexible Height */}
        <main className="flex-1 min-h-0">
            {children}
        </main>
        
        {/* Footer - Fixed Height */}
        <footer className="backdrop-blur-xl">
            <MenuTabs />
        </footer>
        
        {/* Background Image */}
        {backgroundImage}
    </div>
);
}
