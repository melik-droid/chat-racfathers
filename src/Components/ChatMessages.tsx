import React, { useRef, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import TypingIndicator from './TypingIndicator';
import ChatMessage from './ChatMessage';
import type { Message } from './chatTypes';

interface ChatMessagesProps {
  messages: Message[];
  loadingChat: boolean;
  botTyping: boolean;
  isNewMessage: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  loadingChat,
  botTyping,
  isNewMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loadingChat) {
    return <LoadingSpinner />;
  }

  return (
    <div className="animate-fadein space-y-4">
      {messages.map((msg, index) => (
        <div key={msg.id} className="mb-4">
          <ChatMessage
            message={msg}
            isLatest={index === messages.length - 1}
            isNewMessage={isNewMessage}
          />
        </div>
      ))}
      {botTyping && <TypingIndicator />}
      <div ref={messagesEndRef} className="h-6" />
    </div>
  );
};

export default ChatMessages; 