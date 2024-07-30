import { AuditTrail } from "./custom";

export interface Comment extends AuditTrail {
  _id: string;
  content: string;
  author: any;
  post: any;
}

export type CommentCreate = Pick<Comment, "content" | "author" | "post">;
export type CommentGet = Pick<Comment, "_id">;
export type CommentPostGet = Pick<Comment, "post">;

export interface CommentService {
  create(data: CommentCreate): Promise<Comment>;
  get(data: CommentGet): Promise<Comment>;
  list(data: CommentPostGet): Promise<Comment[]>;
  delete(data: CommentGet): Promise<Comment>;
}


