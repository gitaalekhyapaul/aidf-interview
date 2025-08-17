export type ChatMessage = {
  type: "ai" | "human";
  data: {
    content: string;
  };
};
export type GetChatResponse = Array<ChatMessage>;
export type SendChatResponse = {
  response: string;
};
