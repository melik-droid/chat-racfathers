import { DecodedMessage } from "@xmtp/browser-sdk";
import type { Message } from "../Components/chatTypes";

// XMTP mesajını uygulama mesaj formatına dönüştürme
export function xmtpToAppMessage(xmtpMsg: DecodedMessage, currentUserAddress?: string): Message {
  const isSenderSelf = currentUserAddress && xmtpMsg.senderInboxId.toLowerCase() === currentUserAddress.toLowerCase();
  
  // Ensure content is a string
  let content: string;
  if (typeof xmtpMsg.content === 'string') {
    content = xmtpMsg.content;
  } else if (xmtpMsg.content instanceof Object) {
    content = JSON.stringify(xmtpMsg.content);
  } else {
    content = String(xmtpMsg.content);
  }

  const DEFAULT_PEER =
  "5a9d13fa8a62512ca4bf2e50f0f64549d207e53954df080145f435e160878b65";

  const sender =
    xmtpMsg.senderInboxId === DEFAULT_PEER
      ? "bot"
      : "user";

  return {
    id: xmtpMsg.id,
    sender: sender,
    text: content,
    timestamp: new Date(), // Use current time if sent time is not available
  };
}

// Mesaj geçmişini formatla
export function formatDate(date: Date): string {
  return date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Kısaltılmış adres oluşturma
export function shortAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}