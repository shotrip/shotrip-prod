import { SpotSource } from "./spot";

export type ChatMessage = {
  pk: string;
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: SpotSource[];
  isLoading?: boolean;
  isWaiting?: boolean;
  is_good?: boolean;
};

