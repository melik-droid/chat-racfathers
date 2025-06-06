import { AGENT_AVATAR } from "./chatConstants";

const TypingIndicator = () => (
  <div className="flex justify-start items-end gap-2">
    <img
      src={AGENT_AVATAR}
      alt="Agent"
      className="w-9 h-9 rounded-full mr-1 self-end"
    />
    <div className="max-w-lg px-5 py-3 rounded-2xl bg-zinc-700 text-white rounded-bl-md flex items-center gap-2">
      <span
        className="inline-block w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></span>
      <span
        className="inline-block w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
        style={{ animationDelay: "120ms" }}
      ></span>
      <span
        className="inline-block w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
        style={{ animationDelay: "240ms" }}
      ></span>
      <span className="ml-2 text-zinc-400 text-xs">
        Consigliere is typing...
      </span>
    </div>
  </div>
);

export default TypingIndicator;
