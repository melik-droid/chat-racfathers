import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 h-14 bg-zinc-950 border-b border-zinc-800 flex items-center px-6 z-10">
    <span className="text-lg font-bold tracking-wide flex items-center gap-2">
      <img
        src="/src/assets/RacFathers-Logo.svg"
        alt="RacFathers Logo"
        style={{ height: "47px" }}
      />
    </span>
    <div className="ml-auto flex items-center gap-4">
      <ConnectButton />
      <button className="rounded-full bg-zinc-800 p-2 hover:bg-zinc-700 transition-colors">
        <svg
          width="35"
          height="35"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6.5H20M4 12.5H20M4 18.5H20"
            stroke="#F7F7F7"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </button>
    </div>
  </nav>
);

export default Navbar;
