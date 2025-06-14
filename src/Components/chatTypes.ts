export interface Message {
  id: string;
  sender: "user" | "bot" | "peer";
  text: string;
  timestamp?: Date;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  history: Message[];

}
