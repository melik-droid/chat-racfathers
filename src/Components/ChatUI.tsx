import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    setMessages(selectedChat.history);
    setIsNewMessage(false);
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
        text: "This is an agent reply. Fugiat ullamco irure commodo deserunt amet minim cupidatat excepteur cupidatat proident est pariatur proident. Velit magna sint proident cupidatat deserunt ullamco ex. Est deserunt sit labore reprehenderit sunt. Voluptate eu esse ea qui aliquip eiusmod exercitation. Voluptate non nostrud fugiat aliqua ad deserunt sint exercitation excepteur veniam incididunt aliquip cupidatat et. Dolore in amet enim reprehenderit Lorem Lorem velit et et culpa ut elit consectetur dolor.",
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
    setIsNewMessage(false);
    setTimeout(() => setIsNewMessage(true), 0);
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
      <ChatSidebar
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
      <main className="flex-1 flex flex-col pt-14 relative overflow-hidden">
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
            <ChatMessages
              messages={messages}
              loadingChat={loadingChat}
              botTyping={botTyping}
              isNewMessage={isNewMessage}
            />
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
