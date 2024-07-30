import express, {
  Application,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import * as types from "../types";

export interface Request extends ExpressRequest {
  request_id: string;
}

export interface Response extends ExpressResponse {
  request_id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: types.UserTokenPayload;
}

export interface Server {
  app: Application;
  userService: types.UserService;
  postService: types.PostService;
  commentService: types.CommentService;
}

export { Router, NextFunction, Application } from "express";
export { Server as HttpServer } from "http";
export { express };
