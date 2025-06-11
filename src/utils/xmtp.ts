import { DecodedMessage } from "@xmtp/browser-sdk";
import type { Message } from "../Components/chatTypes";

// XMTP mesajını uygulama mesaj formatına dönüştürme
export function xmtpToAppMessage(xmtpMsg: DecodedMessage, currentUserAddress?: string): Message {
  const isSenderSelf = currentUserAddress && xmtpMsg.senderInboxId.toLowerCase() === currentUserAddress.toLowerCase();
  return {
    id: xmtpMsg.id, // String olarak bırakın
    sender: isSenderSelf ? "bot" : "user",
    text: xmtpMsg.content,
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