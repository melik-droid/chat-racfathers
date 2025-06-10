import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import ChatSidebar from "./ChatSidebar";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
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
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages(selectedChat.history);
    setIsNewMessage(false);
    setTimeout(scrollToBottom, 100);
  }, [selectedChat]);

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
    setIsNewMessage(true);
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
      scrollToBottom();
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
    setIsNewMessage(false);
    setIsSidebarOpen(false);
    setTimeout(() => {
      setIsNewMessage(true);
      scrollToBottom();
    }, 100);
  };

  const handleSelectChat = (chat: Chat) => {
    if (selectedChat.id !== chat.id) {
      setLoadingChat(true);
      setTimeout(() => {
        setSelectedChat(chat);
        setMessages(chat.history);
        scrollToBottom();
      }, 500);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`md:relative md:translate-x-0 md:z-0 fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <ChatSidebar
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={(chat) => {
            handleSelectChat(chat);
            setIsSidebarOpen(false);
          }}
          onNewChat={handleNewChat}
        />
      </div>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <main 
        className="flex-1 flex flex-col pt-14 relative overflow-hidden"
        onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
      >
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
        <div className="flex-1 px-4 md:px-8 py-6 overflow-y-auto flex flex-col gap-6 bg-transparent relative z-10">
          <div className="relative z-10 h-full">
            <ChatMessages
              messages={messages}
              loadingChat={loadingChat}
              botTyping={botTyping}
              isNewMessage={isNewMessage}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          botTyping={botTyping}
        />
      </main>
    </div>
  );
};

export default ChatUI;
