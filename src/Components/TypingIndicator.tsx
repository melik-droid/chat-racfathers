import { AGENT_AVATAR } from "./chatConstants";

const TypingIndicator = () => (
  <div className="flex justify-start items-start">
    <img
      src={AGENT_AVATAR}
      alt="Agent"
      className="w-9 h-9 rounded-full mr-3 mt-1"
    />
    <div className="max-w-lg px-5 py-3 rounded-2xl bg-zinc-800/80 backdrop-blur-sm text-white shadow-lg mb-4">
      <span className="text-base">
        <span className="inline-block w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
        <span className="inline-block w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce ml-1.5" style={{ animationDelay: "120ms" }}></span>
        <span className="inline-block w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce ml-1.5" style={{ animationDelay: "240ms" }}></span>
      </span>
    </div>
  </div>
);

export default TypingIndicator;
