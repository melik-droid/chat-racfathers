import React, { useRef } from 'react';

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  botTyping: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onInputChange,
  onSend,
  botTyping,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!botTyping) {
      inputRef.current?.focus();
    }
  }, [botTyping]);

  return (
    <form
      className="flex items-center px-8 py-5 bg-zinc-900 border-t border-zinc-800 relative z-10"
      onSubmit={onSend}
    >
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Write a message"
        className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-base outline-none mr-3 text-white placeholder-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={botTyping}
      />
      <button
        type="submit"
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-6 py-3 font-medium border border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800"
        disabled={botTyping}
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
  );
};

export default ChatInput; 