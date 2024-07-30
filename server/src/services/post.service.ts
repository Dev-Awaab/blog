import {
  PaginationResponse,
  Post,
  PostCreate,
  PostFilter,
  PostGet,
  PostService,
  PostUpdate,
} from "src/types";
import { DBObj } from "../models";
import { paginate } from "../lib";

export interface PostStore {
  DB: typeof DBObj;
}

export function newPostStore(p: PostStore): PostService {
  async function create(data: PostCreate): Promise<Post> {
    return (await p.DB.Post.create({ ...data })) as unknown as Post;
  }

  async function get(data: PostGet): Promise<Post> {
    return (await p.DB.Post.findById({ _id: data._id })).populate(
      "author"
    ) as unknown as Post;
  }

  async function update(data: PostUpdate): Promise<Post> {
    return (await p.DB.Post.findByIdAndUpdate(
      { _id: data._id },
      { ...data },
      { new: true }
    )) as unknown as Post;
  }

  async function deletePost(data: PostGet): Promise<Post> {
    return (await p.DB.Post.findByIdAndDelete({
      _id: data._id,
    })) as unknown as Post;
  }

  async function list(filter: PostFilter): Promise<PaginationResponse<Post>> {
    const searchCriteria: any = {};

    if (filter?.title) {
      searchCriteria.title = { $regex: filter.title, $options: "i" };
    }

    if (filter?.query) {
      searchCriteria.$or = [
        { title: { $regex: filter.query, $options: "i" } },
        { content: { $regex: filter.query, $options: "i" } },
      ];
    }

    const limit = filter?.limit ?? 10;
    const page = filter?.page ?? 1;
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      p.DB.Post.find(searchCriteria)
        .populate("author", "name")
        .skip(offset)
        .limit(limit) as unknown as Post[],
      p.DB.Post.countDocuments(searchCriteria),
    ]);

    return paginate(total, { page, limit }, data);
  }

  async function getRelatedPost(data: PostGet): Promise<Post[]> {
    const post = await p.DB.Post.findById(data._id);
    if (!post) {
      throw new Error("Post not found");
    }
    return (await p.DB.Post.find({
      _id: { $ne: data._id },
      title: { $regex: post.title.split(" ").join("|"), $options: "i" },
    }).limit(5)) as unknown as Post[];
  }
  return {
    create,
    get,
    update,
    delete: deletePost,
    list,
    getRelatedPost,
  };
}
