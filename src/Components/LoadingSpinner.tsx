import { AGENT_AVATAR } from "./chatConstants";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full w-full animate-fadein">
    <img
      src={AGENT_AVATAR}
      alt="Agent"
      className="w-16 h-16 mb-2 animate-bounce"
      style={{ animationDuration: "1s", animationIterationCount: "infinite" }}
    />
    <span className="text-zinc-400 text-base">Loading chat...</span>
  </div>
);

export default LoadingSpinner;
