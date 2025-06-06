export interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  history: Message[];
}
