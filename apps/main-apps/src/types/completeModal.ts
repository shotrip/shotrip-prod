import { Reward } from "./stampReward";

export type CompleteModalProps = {
    routeLabel: string;
    reward: Reward;
    onClose: () => void;
}