import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import RacfathersLogo from "../assets/RacFathers-Logo.svg";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => (
  <nav className="fixed top-0 left-0 right-0 h-14 bg-zinc-950 border-b border-zinc-800 flex items-center px-6 z-10">
    <button 
      onClick={onMenuClick}
      className="md:hidden rounded-full bg-zinc-800 p-2 hover:bg-zinc-700 transition-colors mr-4"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 6.5H20M4 12.5H20M4 18.5H20"
          stroke="#F7F7F7"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
    <span className="text-lg font-bold tracking-wide flex items-center gap-2">
      <a 
        href="https://racfathers.io/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
      >
        <img
          src={RacfathersLogo}
          alt="RacFathers Logo"
          className="h-[47px]"
        />
      </a>
    </span>
      
    <div className="ml-auto flex items-center" style={{ height: "47px" }}>
      <ConnectButton />
    </div>
  </nav>
);

export default Navbar;
