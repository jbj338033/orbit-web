import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenStore {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearTokens: () => void;
}

export const useTokenStore = create(
  persist<TokenStore>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: (accessToken: string) => set({ accessToken }),
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "token-storage",
    }
  )
);
