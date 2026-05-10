import { SpotSource } from "./spot";

export type FavoriteSpotContextProps = {
    favorites: SpotSource[];
    favSpotIds: Set<string>;
    isLoading: boolean;
    fetchFavorites: () => Promise<void>
    toggleFavState: (spot: SpotSource, isFav: boolean) => void;
}