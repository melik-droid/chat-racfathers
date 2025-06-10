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
      className="px-4 py-3 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 relative z-10"
      onSubmit={onSend}
    >
      <div className="max-w-6xl mx-auto">
        <div className="relative flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 h-12 px-6 bg-zinc-800/80 border border-zinc-700/50 rounded-xl text-base outline-none text-white placeholder-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/20"
            disabled={botTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || botTyping}
            className="flex items-center justify-center h-12 w-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800 group"
            title="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput; 