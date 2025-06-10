import React from 'react';
import TypedMessage from './TypedMessage';
import { AGENT_AVATAR } from './chatConstants';
import type { Message } from './chatTypes';

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
  isNewMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest, isNewMessage }) => {
  if (message.sender === "bot") {
    return (
      <div className="flex justify-start items-start">
        <img
          src={AGENT_AVATAR}
          alt="Agent"
          className="w-9 h-9 rounded-full mr-2 md:mr-3 mt-1"
        />
        <div className="max-w-lg px-4 md:px-5 py-3 rounded-2xl text-base break-words bg-zinc-800/80 backdrop-blur-sm text-white shadow-lg">
          <TypedMessage 
            text={message.text} 
            isLatest={isLatest && isNewMessage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-lg px-4 md:px-5 py-3 rounded-2xl text-base break-words bg-zinc-700/80 backdrop-blur-sm text-white shadow-lg">
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage; 