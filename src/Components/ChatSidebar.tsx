import React from "react";
import { AGENT_AVATAR } from "./chatConstants";
import type { Chat } from "./chatTypes";

interface ChatSidebarProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
  isXmtpEnabled: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  selectedChat,
  onSelectChat,
  onNewChat,
  isXmtpEnabled,
}) => {
  return (
    <aside className="w-72 h-full bg-zinc-900/95 backdrop-blur-sm border-r border-zinc-800 flex flex-col pt-14 md:relative">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white">
          {isXmtpEnabled ? "XMTP Sohbetleri" : "Sohbetler"}
        </h2>
        <p className="text-sm text-zinc-400">
          {isXmtpEnabled
            ? "Cüzdanlar arası şifrelenmiş mesajlaşma"
            : "Sohbet geçmişiniz"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        {chats.length === 0 && (
          <div className="text-center text-zinc-500 py-8">
            {isXmtpEnabled
              ? "Henüz bir sohbetiniz yok. Yeni bir sohbet başlatın."
              : "Cüzdanınızı bağlayın ve XMTP'ye katılın."}
          </div>
        )}

        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg mb-1 transition-all duration-200 ${
              selectedChat?.id === chat.id
                ? "bg-zinc-800/80 shadow-lg shadow-zinc-900/20"
                : "hover:bg-zinc-800/50"
            }`}
          >
            <div className="relative">
              <img
                src={AGENT_AVATAR}
                alt={chat.name}
                className="w-10 h-10 rounded-full border-2 border-zinc-700 transition-transform duration-200 hover:scale-105"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-zinc-900 ${
                  selectedChat?.id === chat.id ? "bg-green-500" : "bg-zinc-600"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-base text-white truncate">
                {chat.name}
              </p>
              <p className="text-xs text-zinc-400 truncate">
                {chat.history[chat.history.length - 1]?.text ||
                  "Henüz mesaj yok"}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-zinc-800">
        <button
          onClick={onNewChat}
          disabled={!isXmtpEnabled}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white transition-all duration-200 hover:shadow-lg hover:shadow-zinc-900/20 disabled:opacity-50 disabled:hover:bg-zinc-800 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span className="font-medium">Yeni Sohbet</span>
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
