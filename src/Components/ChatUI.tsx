import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import type { Dm } from "@xmtp/browser-sdk";
import { useXmtp } from "../contexts/XmtpContext";
import Navbar from "./Navbar";
import ChatSidebar from "./ChatSidebar";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { AGENT_AVATAR } from "./chatConstants";
import { xmtpToAppMessage, shortAddress } from "../utils/xmtp";
import type { Message, Chat } from "./chatTypes";
import bg from "../assets/bg.png";

const DEFAULT_PEER =
  "5a9d13fa8a62512ca4bf2e50f0f64549d207e53954df080145f435e160878b65";

const ChatUI: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Dm<any>[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Dm<any> | null>(null);
  const [input, setInput] = useState("");
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map());
  const [botTyping, setBotTyping] = useState(false);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { client, initializing: isLoading, initialize } = useXmtp();
  const { address, isConnected } = useAccount();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // XMTP istemcisini başlat
  useEffect(() => {
    if (isConnected && !client) {
      initialize();
    }
  }, [isConnected, client, initialize]);

  // Helper function to update loading state for a specific chat
  const setChatLoading = (chatId: string, isLoading: boolean) => {
    setLoadingStates(prev => {
      const newMap = new Map(prev);
      newMap.set(chatId, isLoading);
      return newMap;
    });
  };

  // Helper function to get loading state for a specific chat
  const isChatLoading = (chatId: string) => {
    return loadingStates.get(chatId) || false;
  };

  // Konuşmaları yükle
  useEffect(() => {
    const loadConversations = async () => {
      if (!client) return;
      try {
        const dms = await client.conversations.listDms();
        console.log('Loaded DMs:', dms);
        setConversations(dms);

        const fetchMessages = async (convo: Dm<any>) => {
          try {
            if (typeof convo.sync === "function") {
              await convo.sync();
            }
          } catch (syncError) {
            console.error("Konuşma senkronizasyonu başarısız:", syncError);
          }
          try {
            const msgs = await convo.messages();
            console.log('Fetched messages for conversation:', msgs);
            return msgs;
          } catch (msgError) {
            console.error("Mesajlar yüklenemedi:", msgError);
            return [];
          }
        };

        const newChats = await Promise.all(
          dms.map(async (convo) => {
            // Use the conversation's topic or ID as the chat ID
            const convoId = convo.topic || convo.id || `convo-${Date.now()}`;
            console.log('Processing conversation with ID:', convoId);
            setChatLoading(convoId, true);
            const msgs = await fetchMessages(convo);
            setChatLoading(convoId, false);

            // Ensure we're not trying to render any objects directly
            const chatName = typeof convo.peerAddress === 'string' 
              ? shortAddress(convo.peerAddress)
              : shortAddress(DEFAULT_PEER);

            return {
              id: convoId,
              name: chatName,
              avatar: AGENT_AVATAR,
              history: msgs
                .map((msg) => xmtpToAppMessage(msg, address))
                .sort(
                  (a, b) =>
                    (a.timestamp?.getTime() || 0) -
                    (b.timestamp?.getTime() || 0)
                ),
            };
          })
        );
        console.log('Created new chats:', newChats);
        const filteredChats = newChats.filter(Boolean) as Chat[];
        console.log('Filtered chats:', filteredChats);
        setChats(filteredChats);
        if (filteredChats.length > 0) {
          const firstChat = filteredChats[0];
          console.log('Setting first chat as selected:', firstChat);
          setSelectedChat(firstChat);
          setSelectedConversation(dms[0]); // Just use the first conversation for now
          setMessages(firstChat.history || []);
        }
      } catch (error) {
        console.error("Konuşmalar yüklenemedi", error);
      }
    };
    if (client) {
      loadConversations();
    }
  }, [client, address]);

  // Yeni mesajları dinle
  useEffect(() => {
    if (!client || !selectedConversation) return;

    const noop = () => {};

    const onMessage = (
      error: Error | null,
      message: any
    ) => {
      if (message) {
        const appMessage = xmtpToAppMessage(message, DEFAULT_PEER);
        // Only set botTyping to false if the message is from the agent
        if (appMessage.sender === "bot") {
          setBotTyping(false);
        }
        setMessages((prev) => {
          const newMessages = [...prev, appMessage].sort(
            (a, b) =>
              (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0)
          );
          // Update the chat history based on the new messages
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === selectedChat?.id
                ? {
                    ...chat,
                    history: newMessages,
                  }
                : chat
            )
          );
          return newMessages;
        });
        scrollToBottom();
      }
      if (error) {
        console.error("Mesaj stream hatası:", error);
        setBotTyping(false);
      }
    };

    const startStream = async () => {
      const stream = await selectedConversation.stream(onMessage);
      return stream
        ? () => {
            void stream.return(undefined);
          }
        : noop;
    };

    const cleanupPromise = startStream();
    return () => {
      cleanupPromise.then((cleanup) => cleanup());
    };
  }, [client, selectedConversation, selectedChat, address]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedConversation || !client) return;
    let newMsg: Message;
    try {
      const tempId = `temp-${Date.now()}`;
      const sentTimestamp = new Date();

      newMsg = {
        id: tempId,
        sender: "user",
        text: input,
        timestamp: sentTimestamp,
      };

      // setMessages((msgs) => {
      //   return [...msgs, newMsg].sort((a, b) => {
      //     const aTime = a.timestamp ? a.timestamp.getTime() : 0;
      //     const bTime = b.timestamp ? b.timestamp.getTime() : 0;
      //     return aTime - bTime;
      //   });
      // });
      const currentInput = input;
      setInput("");
      setBotTyping(true);

      await selectedConversation.send(currentInput);

      setIsNewMessage(true);
      scrollToBottom();
    } catch (error) {
      console.error("Mesaj gönderilemedi", error);
      // setMessages((prev) => prev.filter((m) => m.id !== newMsg.id));
      setInput(newMsg.text);
      setBotTyping(false);
    }
  };

  const handleNewChat = async () => {
    if (!client) {
      alert("Önce cüzdanınızı bağlamanız gerekiyor.");
      return;
    }
    const peerAddress = DEFAULT_PEER;
    try {
      setChatLoading(peerAddress, true);
      let conversation: Dm<any>;
      try {
        conversation = await client.conversations.newDm(peerAddress);
      } catch {
        alert("Bu adres XMTP ağına kayıtlı değil veya DM başlatılamıyor.");
        setChatLoading(peerAddress, false);
        return;
      }
      const newChat: Chat = {
        id: `${peerAddress}-${Date.now()}`,
        name: shortAddress(peerAddress),
        avatar: AGENT_AVATAR,
        history: [],
      };
      console.log("New Conversation: ", conversation);
      setConversations((prev) => [...prev, conversation]);
      setChats((prev) => [...prev, newChat]);
      setSelectedChat(newChat);
      setSelectedConversation(conversation);
      setMessages([]);
      setIsNewMessage(false);
      await conversation.send("Merhaba! Size XMTP üzerinden ulaştım.");
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Yeni sohbet oluşturulamadı", error);
    } finally {
      setChatLoading(peerAddress, false);
    }
  };

  const handleSelectChat = (chat: Chat) => {
    console.log('handleSelectChat called with chat:', chat);
    console.log('Current selectedChat:', selectedChat);
    console.log('Current conversations:', conversations);
    
    if (selectedChat?.id !== chat.id) {
      setChatLoading(chat.id, true);
      // Extract the peer address from the chat ID (remove the timestamp part)
      const peerAddress = chat.id.split('-')[0];
      console.log('Extracted peerAddress:', peerAddress);
      
      // Find the conversation by matching the chat history
      const conversation = conversations.find((c) => {
        console.log('Checking conversation:', c);
        // Check if this conversation has messages that match our chat history
        return chat.history.length > 0 && c.messages && c.messages.length > 0;
      });
      
      console.log('Found conversation:', conversation);
      
      if (conversation) {
        setSelectedConversation(conversation);
        setSelectedChat(chat);
        setMessages(chat.history);
        console.log('Updated selected chat and conversation');
        console.log('New messages:', chat.history);
      } else {
        console.log('No matching conversation found!');
      }
      setChatLoading(chat.id, false);
      scrollToBottom();
    } else {
      console.log('Same chat selected, no change needed');
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div
        className={`md:relative md:translate-x-0 md:z-0 fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ChatSidebar
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          isXmtpEnabled={!!client}
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
          {!client && !isLoading && (
            <div className="h-full flex items-center justify-center">
              <button
                onClick={initialize}
                className="px-6 py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                XMTP'ye Bağlan
              </button>
            </div>
          )}

          {(client || isLoading) && (
            <div className="relative z-10 h-full">
              <ChatMessages
                messages={messages}
                loadingChat={selectedChat ? isChatLoading(selectedChat.id) : false}
                botTyping={botTyping}
                isNewMessage={isNewMessage}
              />
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        {client && (
          <ChatInput
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            botTyping={botTyping}
          />
        )}
      </main>
    </div>
  );
};

export default ChatUI;
