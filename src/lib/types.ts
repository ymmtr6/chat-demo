export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ProfileAttribute = {
  key: string;
  value: string;
  confidence: number;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
};

export type Message = ChatMessage & {
  id: string;
  createdAt: string;
};

// --- API Request / Response ---

export type ChatRequest = {
  conversationId: string;
  messages: ChatMessage[];
  profile?: ProfileAttribute[];
  config?: {
    model?: string;
    temperature?: number;
  };
};

export type ChatResponse = {
  message: ChatMessage;
};

export type ProfileRequest = {
  messages: ChatMessage[];
  currentProfile?: ProfileAttribute[];
};

export type ProfileResponse = {
  attributes: ProfileAttribute[];
};
