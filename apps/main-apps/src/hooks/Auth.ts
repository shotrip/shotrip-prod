"use client";

import { useState, useEffect } from "react";
import { getCurrentUser, AuthUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

export function useAuth() {
    const [ user, setUser ] = useState<AuthUser | null>(null);
    const [ loading, setLoading ] = useState(true);

    const checkUser = async () => {
        try {
            const CurrentUser = await getCurrentUser();
            setUser(CurrentUser);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();

        const unsubscribe = Hub.listen("auth", ({ payload }) => {
            switch (payload.event) {
                case "signedIn":
                    checkUser();
                    break;
                case "signedOut":
                    setUser(null);
                    break;
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
}