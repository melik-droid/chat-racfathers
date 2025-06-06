import logo from "../assets/logo.svg";
import type { Chat } from "./chatTypes";

export const AGENT_AVATAR = logo;

export const initialChats: Chat[] = [
  {
    id: 1,
    name: "Agent Chat",
    avatar: AGENT_AVATAR,
    history: [
      { id: 1, sender: "bot", text: "Hello! How can I assist you today?" },
    ],
  },
];
