import {
  commentCreateSchema,
  errorResponse,
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

export function commentHttpService(server: Server) {
  function registerCommentRoutes(router: Router) {
    router.post("/comments", authMiddleware, createComment);
    router.get("/comments/:id", authMiddleware, getComment);
    router.get("/comments/post/:postId", authMiddleware, listComments);
    router.delete("/comments/:id", authMiddleware, deleteComment);
  }

  async function createComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { error, value } = validateSchema(commentCreateSchema, req.body);
      if (error) return errorResponse(res, HttpStatusCode.BAD_REQUEST, error);

      const comment = await server.commentService.create({
        ...value,
        author: req.user.id,
      });
      return successResponse(res, HttpStatusCode.CREATED, "Created", comment);
    } catch (error) {
      return serverErrorResponse(res, "[CreateComment]", error);
    }
  }

  async function getComment(req: AuthenticatedRequest, res: Response) {
    try {
      const comment = await server.commentService.get({ _id: req.params.id });
      if (!comment)
        return errorResponse(
          res,
          HttpStatusCode.NOT_FOUND,
          "Comment not found"
        );
      return successResponse(res, HttpStatusCode.OK, "Fetched", comment);
    } catch (error) {
      return serverErrorResponse(res, "[GetComment]", error);
    }
  }

  async function listComments(req: AuthenticatedRequest, res: Response) {
    try {
      const comments = await server.commentService.list({
        post: req.params.postId,
      });
      return successResponse(res, HttpStatusCode.OK, "Fetched", comments);
    } catch (error) {
      return serverErrorResponse(res, "[ListComments]", error);
    }
  }

  async function deleteComment(req: AuthenticatedRequest, res: Response) {
    try {
      const comment = await server.commentService.delete({
        _id: req.params.id,
      });
      if (!comment)
        return errorResponse(
          res,
          HttpStatusCode.NOT_FOUND,
          "Comment not found"
        );
      return successResponse(res, HttpStatusCode.OK, "Deleted", comment);
    } catch (error) {
      return serverErrorResponse(res, "[DeleteComment]", error);
    }
  }

  return { registerCommentRoutes };
}
// www.flashchange.co
