import {
  errorResponse,
  postCreateSchema,
  postUpdateSchema,
  serverErrorResponse,
  successResponse,
  validateSchema,
} from "../lib";
import {
  AuthenticatedRequest,
  HttpStatusCode,
  Response,
  Router,
  Server,
} from "../types";
import { authMiddleware } from "./middleware";

export function postHttpService(server: Server) {
  function registerPostRoutes(router: Router) {
    router.post("/posts", authMiddleware, createPost);
    router.get("/posts/:postId", getPost);
    router.put("/posts/:postId", authMiddleware, updatePost);
    router.delete("/posts/:postId", authMiddleware, deletePost);
    router.get("/posts", listPosts);
    router.get("/posts/related/:postId", authMiddleware, getRelatedPost);
  }

  async function createPost(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { error, value } = validateSchema(postCreateSchema, req.body);
      if (error) return errorResponse(res, HttpStatusCode.BAD_REQUEST, error);

      const post = await server.postService.create({
        ...value,
        author: req.user.id,
      });

      return successResponse(res, HttpStatusCode.CREATED, "Created", post);
    } catch (error) {
      return serverErrorResponse(res, "[CreateUser]", error);
    }
  }

  async function getPost(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const post = await server.postService.get({ _id: req.params.postId });
      if (!post)
        return errorResponse(res, HttpStatusCode.NOT_FOUND, "Post not found");

      return successResponse(res, HttpStatusCode.OK, "OK", post);
    } catch (error) {
      return serverErrorResponse(res, "[GetPost]", error);
    }
  }

  async function updatePost(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { error, value } = validateSchema(postUpdateSchema, req.body);
      if (error) return errorResponse(res, HttpStatusCode.BAD_REQUEST, error);

      const post = await server.postService.update({
        ...value,
        _id: req.params.postId,
      });
      if (!post)
        return errorResponse(res, HttpStatusCode.NOT_FOUND, "Post not found");

      return successResponse(res, HttpStatusCode.OK, "Updated", post);
    } catch (error) {
      return serverErrorResponse(res, "[UpdatePost]", error);
    }
  }

  async function deletePost(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const post = await server.postService.delete({ _id: req.params.postId });
      if (!post)
        return errorResponse(res, HttpStatusCode.NOT_FOUND, "Post not found");

      return successResponse(res, HttpStatusCode.OK, "Deleted", post);
    } catch (error) {
      return serverErrorResponse(res, "[DeletePost]", error);
    }
  }

  async function listPosts(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const filter = {
        title: req.query.title as string,
        query: req.query.query as string,
        limit: parseInt(req.query.limit as string, 10) || 10,
        page: parseInt(req.query.page as string, 10) || 1,
      };

      const posts = await server.postService.list(filter);

      return successResponse(res, HttpStatusCode.OK, "OK", posts);
    } catch (error) {
      return serverErrorResponse(res, "[ListPosts]", error);
    }
  }

  async function getRelatedPost(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const posts = await server.postService.getRelatedPost({
        _id: req.params.postId,
      });
      if (!posts)
        return errorResponse(res, HttpStatusCode.NOT_FOUND, "Posts not found");

      return successResponse(res, HttpStatusCode.OK, "OK", posts);
    } catch (error) {
      return serverErrorResponse(res, "[GetRelatedPost]", error);
    }
  }

  return { registerPostRoutes };
}
// www.flashchange.co
