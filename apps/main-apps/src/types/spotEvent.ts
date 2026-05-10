import { SpotSource } from "./spot";

export const OPEN_SPOT_MODAL = "OPEN_SPOT_MODAL";

export interface OpenSpotModalEvent extends CustomEvent {
  detail: SpotSource;
}

export const openSpotDetail = (spot: SpotSource) => {
    const event = new CustomEvent(OPEN_SPOT_MODAL, {detail: spot});
    window.dispatchEvent(event);
};

declare global {
    interface WindowEventMap {
        [OPEN_SPOT_MODAL]: OpenSpotModalEvent;
    }
}
