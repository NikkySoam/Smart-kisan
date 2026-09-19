export type ChatMessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
}

export interface ChatbotResponse {
  success?: boolean;
  answer?: string;
  message?: string;
}
