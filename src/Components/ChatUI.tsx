import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import LoadingSpinner from "./LoadingSpinner";
import TypingIndicator from "./TypingIndicator";
import { AGENT_AVATAR, initialChats } from "./chatConstants";
import type { Message, Chat } from "./chatTypes";
import bg from "../assets/bg.png";

const ChatUI: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChat, setSelectedChat] = useState<Chat>(initialChats[0]);
  const [messages, setMessages] = useState<Message[]>(initialChats[0].history);
  const [input, setInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages(selectedChat.history);
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (loadingChat) {
      const timer = setTimeout(() => setLoadingChat(false), 600);
      return () => clearTimeout(timer);
    }
  }, [loadingChat]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg: Message = { id: Date.now(), sender: "user", text: input };
    setChats((prevChats) => {
      return prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, history: [...chat.history, newMsg] }
          : chat
      );
    });
    setMessages((msgs) => [...msgs, newMsg]);
    setInput("");
    setBotTyping(true);
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: "This is an agent reply.",
      };
      setChats((prevChats) => {
        return prevChats.map((chat) =>
          chat.id === selectedChat.id
            ? { ...chat, history: [...chat.history, botMsg] }
            : chat
        );
      });
      setMessages((msgs) => [...msgs, botMsg]);
      setBotTyping(false);
    }, 800);
  };

  const handleNewChat = () => {
    const newId = chats.length + 1;
    const newChat: Chat = {
      id: newId,
      name: `Agent Chat ${newId}`,
      avatar: AGENT_AVATAR,
      history: [
        {
          id: Date.now(),
          sender: "bot",
          text: "Hello! How can I assist you today?",
        },
      ],
    };
    setChats((prev) => [...prev, newChat]);
    setSelectedChat(newChat);
    setMessages(newChat.history);
  };

  const handleSelectChat = (chat: Chat) => {
    if (selectedChat.id !== chat.id) {
      setLoadingChat(true);
      setTimeout(() => {
        setSelectedChat(chat);
        setMessages(chat.history);
      }, 500);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Navbar />
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col pt-14">
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
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
            onClick={handleNewChat}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-700 text-2xl text-white"
            title="New Chat"
          >
            +
          </button>
        </div>
      </aside>
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col pt-14 relative overflow-hidden">
        {/* Background image with dim overlay only for chat area */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.3)",
            opacity: 0.7,
          }}
        />
        <div className="flex-1 px-8 py-8 overflow-y-auto flex flex-col gap-6 bg-transparent relative z-10">
          <div className="relative z-10 h-full">
            {loadingChat ? (
              <LoadingSpinner />
            ) : (
              <div className="animate-fadein">
                {messages.map((msg) =>
                  msg.sender === "bot" ? (
                    <div key={msg.id} className="flex justify-start">
                      <img
                        src={AGENT_AVATAR}
                        alt="Agent"
                        className="w-9 h-9 rounded-full mr-3 self-end"
                      />
                      <div
                        className={`max-w-lg px-5 py-3 rounded-2xl text-base break-words bg-zinc-700 text-white rounded-bl-md`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-lg px-5 py-3 rounded-2xl text-base break-words bg-zinc-800 text-white rounded-br-md">
                        {msg.text}
                      </div>
                    </div>
                  )
                )}
                {botTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
        <form
          className="flex items-center px-8 py-5 bg-zinc-900 border-t border-zinc-800 relative z-10"
          onSubmit={handleSend}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message"
            className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-base outline-none mr-3 text-white placeholder-zinc-400"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-6 py-3 font-medium border border-zinc-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatUI;
