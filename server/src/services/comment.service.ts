import { DBObj } from "../models";
import {
  CommentCreate,
  CommentGet,
  CommentPostGet,
  CommentService,
} from "../types";

export interface CommentStore {
  DB: typeof DBObj;
}

export function newCommentStore(c: CommentStore): any {
  async function create(data: CommentCreate): Promise<Comment> {
    return (await c.DB.Comment.create(data)) as unknown as Comment;
  }

  async function get(data: CommentGet): Promise<Comment> {
    return (await c.DB.Comment.findById(data._id)) as Comment;
  }

  async function list(data: CommentPostGet): Promise<Comment[]> {
    return (await c.DB.Comment.find({ post: data.post }).populate(
      "author",
      "name email"
    )) as unknown as Comment[];
  }

  async function deleteComment(data: CommentGet): Promise<Comment> {
    return (await c.DB.Comment.findByIdAndDelete(data._id)) as Comment;
  }

  return {
    create,
    get,
    list,
    delete: deleteComment,
  };
}
