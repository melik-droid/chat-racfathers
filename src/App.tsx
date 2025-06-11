import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ChatUI from "./Components/ChatUI";
import { XmtpProvider } from "./contexts/XmtpContext";

const config = getDefaultConfig({
  appName: "Chat Connect",
  projectId: "3a71a463aa1d5e0c6e56bbbfae79fab8", // WalletConnect Project ID'nizi buraya ekleyin
  chains: [base, mainnet],
  ssr: false,
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <XmtpProvider>
            <ChatUI />
          </XmtpProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
