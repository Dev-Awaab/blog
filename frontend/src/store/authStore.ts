import { create } from "zustand";

interface User {
  _id: string;
  name: string;
  email: string;
}

const userLoc = JSON.parse(localStorage.getItem("user") || "null");

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (userData: { user: User; token: string }) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: userLoc ? userLoc : null,
  token: null,
  setUser: ({ user, token }) => set({ user, token }),
}));
