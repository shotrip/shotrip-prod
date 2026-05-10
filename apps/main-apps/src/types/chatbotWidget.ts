import { LensContext } from "./lensContext";

export interface ChatbotWidgetProps {
    compact?: boolean;
    lensContext: LensContext | null;
}