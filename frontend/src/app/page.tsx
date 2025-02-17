"use client"
import Image from "next/image";
import Player from '@/components/Player';
import Header from '@/components/Header';
import MenuTabs from '@/components/Tabs';



const Home = () => {

    return (
        <div className="h-screen flex flex-col">
            {/* Header - Fixed Height */}
            <Header />
            
            {/* Main Content - Flexible Height */}
            <main className="flex-1 min-h-0">
                <Player />
            </main>
            
            {/* Footer - Fixed Height */}
            <footer className="backdrop-blur-xl">
                {/* <div className="w-full h-0.5 bg-gray-100">
                    <div className="w-1/3 h-full bg-gray-900"></div>
                </div> */}
                <MenuTabs />
            </footer>
            
            {/* Background Image */}
            <Image 
                className="fixed -inset-0 -z-50 blur-xl opacity-30" 
                src="/cover.jpeg" 
                alt="cover" 
                layout="fill" 
                objectFit="cover"
                priority
            />
        </div>
    );
};

export default Home;