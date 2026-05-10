export type TokenContextProps = {
    free: number;
    paid: number;
    isDepleted: boolean,
    loading: boolean,
    is_unlimited?: boolean;
    unlimited_until?: string | null;
}

export type Tokens = {
    free: number;
    paid: number;
    is_unlimited?: boolean;
    unlimited_until?: string | null;
}