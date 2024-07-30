import create from "zustand";

interface Comment {
  _id: string;
  content: string;
  author: any;
  post: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentState {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),
}));
