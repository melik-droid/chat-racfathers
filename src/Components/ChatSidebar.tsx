import React from 'react';
import { AGENT_AVATAR } from './chatConstants';
import type { Chat } from './chatTypes';

interface ChatSidebarProps {
  chats: Chat[];
  selectedChat: Chat;
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  selectedChat,
  onSelectChat,
  onNewChat,
}) => {
  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col pt-14">
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-zinc-800 transition-colors ${
              selectedChat.id === chat.id ? "bg-zinc-800" : ""
            }`}
          >
            <img
              src={AGENT_AVATAR}
              alt={chat.name}
              className="w-10 h-10 rounded-full border-2 border-zinc-700"
            />
            <span className="font-medium text-base">{chat.name}</span>
          </button>
        ))}
      </div>
      <div className="h-16 flex items-center justify-center border-t border-zinc-800">
        <button
          onClick={onNewChat}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-700 text-2xl text-white"
          title="New Chat"
        >
          +
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar; 