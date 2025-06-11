import React from "react";
import { useXmtp } from "../contexts/XmtpContext";
import { useAccount } from "wagmi";

const XmtpStatusIndicator: React.FC = () => {
  const { client, initializing: isLoading, initialize } = useXmtp();
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg text-zinc-300 text-sm">
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        Cüzdan Bağlanmadı
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg text-zinc-300 text-sm">
        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
        XMTP Yükleniyor...
      </div>
    );
  }

  if (client) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg text-zinc-300 text-sm">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        XMTP Bağlı
      </div>
    );
  }

  return (
    <button
      onClick={initialize}
      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 text-sm transition-colors"
    >
      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
      XMTP'yi Etkinleştir
    </button>
  );
};

export default XmtpStatusIndicator;
