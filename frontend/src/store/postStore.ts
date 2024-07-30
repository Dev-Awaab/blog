import { create } from "zustand";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface PostState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
}));
