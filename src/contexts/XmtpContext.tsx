import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { Client } from "@xmtp/browser-sdk";
import { useAccount, useWalletClient } from "wagmi";
import { createEOASigner } from "../utils/signer";

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------
interface XmtpContextValue {
  client: Client | null;
  initializing: boolean;
  error: Error | null;
  initialize: () => Promise<Client | null>;
  disconnect: () => void;
}

const XmtpContext = createContext<XmtpContextValue | undefined>(undefined);

export const useXmtp = (): XmtpContextValue => {
  const ctx = useContext(XmtpContext);
  if (!ctx) {
    throw new Error("useXmtp must be used within <XmtpProvider>");
  }
  return ctx;
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export const XmtpProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [client, setClient] = useState<Client | null>(null);
  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initializingRef = useRef(false);

  const DEFAULT_PEER =
    "5a9d13fa8a62512ca4bf2e50f0f64549d207e53954df080145f435e160878b65";
  // const DEFAULT_PEER = "0x7c83f09fc37d5cc2c3096c98e57f4e57f4036e2b";

  // -------------------------------------------------------------------------
  // Core initialise logic (using createEOASigner only)
  // -------------------------------------------------------------------------
  const initialiseWithSigner = async (): Promise<Client> => {
    if (!walletClient || !address) {
      throw new Error("Wallet client unavailable – cannot create XMTP signer");
    }
    const signer = createEOASigner(address, (msg: string) =>
      walletClient.signMessage({ message: msg })
    );
    const c = await Client.create(signer, { env: "production" });
    return c;
  };

  const initialize = useCallback(async (): Promise<Client | null> => {
    if (client) return client;
    if (!isConnected || !address) {
      setError(new Error("Wallet is not connected"));
      return null;
    }
    if (initializingRef.current) return null;

    initializingRef.current = true;
    setInitializing(true);
    setError(null);

    try {
      // Her durumda yeni istemci oluştur
      const xmtp = await initialiseWithSigner();
      console.log("Default");

      // Warm‑up default conversation if possible
      await xmtp.conversations.newDm(DEFAULT_PEER);

      setClient(xmtp);
      console.log("Client setted!");
      return xmtp;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setInitializing(false);
      initializingRef.current = false;
    }
  }, [client, isConnected, address, walletClient]);

  // -------------------------------------------------------------------------
  // Disconnect logic
  // -------------------------------------------------------------------------
  const disconnect = useCallback(() => {
    client?.close();
    setClient(null);
  }, [client]);

  // Auto‑disconnect when wallet disconnects
  useEffect(() => {
    if (!isConnected && client) {
      disconnect();
    }
  }, [isConnected, client, disconnect]);

  // -------------------------------------------------------------------------
  // Context value
  // -------------------------------------------------------------------------
  const contextValue = useMemo<XmtpContextValue>(
    () => ({ client, initializing, error, initialize, disconnect }),
    [client, initializing, error, initialize, disconnect]
  );

  return (
    <XmtpContext.Provider value={contextValue}>{children}</XmtpContext.Provider>
  );
};
