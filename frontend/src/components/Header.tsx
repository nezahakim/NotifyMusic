import React from "react";
import Image from "next/image";
import { Notification, Sun } from "@/utils/icons";

const Header = () => (
    <div className="w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-gray-100/80 rounded-xl px-3 py-1.5">
            <Image src="/file.svg" alt="Logo" width={20} height={20} className="w-5 h-5" />
            <span className="text-base font-medium text-gray-900">Tune+</span>
        </div>
        <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-all">
                <Notification className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-all">
                <Sun className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    </div>
);

export default Header;