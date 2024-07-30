import {
  AuthenticatedRequest,
  HttpStatusCode,
  NextFunction,
  Response,
} from "../../types";
import Config from "../../config";
import jwt from "jsonwebtoken";
import { errorResponse } from "../../lib";

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return errorResponse(
      res,
      HttpStatusCode.UNAUTHORIZED,
      "Access denied. No token provided."
    );
  }

  try {
    const decoded = jwt.verify(token, Config.jwtSecrect) as {
      email: string;
      id: string;
      role: string;
    };

    req.user = decoded;

    next();
  } catch (ex) {
    return errorResponse(
      res,
      HttpStatusCode.UNAUTHORIZED,
      "Not authorized to access this route",
      ex
    );
  }
};
