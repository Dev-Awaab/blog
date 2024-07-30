import {
  AuditTrail,
  PaginationParam,
  PaginationResponse,
  Search,
} from "./custom";

export interface Post extends AuditTrail {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: string;
}

export type PostCreate = Pick<Post, "title" | "content" | "image" | "author">;
export type PostGet = Pick<Post, "_id">;
export type PostUpdate = Partial<
  Pick<Post, "_id" | "title" | "content" | "image">
>;

export interface PostFilter extends Partial<Post>, PaginationParam, Search {
  title?: string;
}

export interface PostService {
  create(data: PostCreate): Promise<Post>;
  get(data: PostGet): Promise<Post>;
  update(data: PostUpdate): Promise<Post>;
  delete(data: PostGet): Promise<Post>;
  list(filter: PostFilter): Promise<PaginationResponse<Post>>;
  getRelatedPost(data: PostGet): Promise<Post[]>;
}
