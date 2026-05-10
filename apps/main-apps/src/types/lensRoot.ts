import { ChatbotWidgetProps } from "./chatbotWidget";

export type LensRootProps = ChatbotWidgetProps & {
  tenant: string;
  namespace: string;
  token: string;
};