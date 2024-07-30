import {
  createUserSchema,
  validateSchema,
  errorResponse,
  serverErrorResponse,
  successResponse,
  loginUserSchema,
  generateAccessToken,
  generateRefreshToken,
  cleanMongooseDoc,
} from "../lib";
import { Request, Response, Router, Server } from "../types";
import { HttpStatusCode } from "../types/enums";

export function userHttpService(server: Server) {
  function registerUserRoutes(router: Router) {
    router.post("/users", register);
    router.post("/users/login", login);
  }

  async function register(req: Request, res: Response): Promise<Response> {
    try {
      const { error, value } = validateSchema(createUserSchema, req.body);
      if (error) return errorResponse(res, HttpStatusCode.BAD_REQUEST, error);

      const user = await server.userService.get({ email: value.email });

      if (user)
        return errorResponse(
          res,
          HttpStatusCode.BAD_REQUEST,
          "User already exists"
        );

      await server.userService.create(value);

      return successResponse(
        res,
        HttpStatusCode.CREATED,
        "User Created, You can now login"
      );
    } catch (error) {
      return serverErrorResponse(res, "[CreateUser]", error);
    }
  }

  async function login(req: Request, res: Response) {
    try {
      const { error, value } = validateSchema(loginUserSchema, req.body);
      if (error) return errorResponse(res, HttpStatusCode.BAD_REQUEST, error);

      const user = await server.userService.get({ email: value.email });

      if (!user)
        return errorResponse(
          res,
          HttpStatusCode.NOT_FOUND,
          "User does not exists"
        );

      if (!user.comparePassword(value.password))
        return errorResponse(
          res,
          HttpStatusCode.UNAUTHORIZED,
          "Invalid password"
        );

      const cleanedUser = cleanMongooseDoc(user);
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      return successResponse(res, HttpStatusCode.OK, "logged in", {
        ...cleanedUser,
        access_token: accessToken,
      });
    } catch (error) {
      return serverErrorResponse(res, "[login]", error);
    }
  }

  return { registerUserRoutes };
}
