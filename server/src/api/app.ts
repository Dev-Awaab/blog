import {
  Application,
  express,
  HttpServer,
  NextFunction,
  Request,
  Response,
  Server,
} from "../types";
import Config from "../config";
import { logRequestMiddleware } from "../log";
import connectDB from "../database/mongodb";
import * as services from "../services";
import * as httpService from "../api";
import { DBObj } from "../models";
import logRoutes from "../log/routerLogger";

const startNewApplication = (): Application => {
  const app = express();

  app.set("port", Config.port);

  // parse request body
  app.use(express.json());

  // parse query string using querystring library
  app.use(express.urlencoded({ extended: false }));

  // set headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Accept, Content-Length, Content-Type, Authorization"
    );
    next();
  });

  // log request
  app.use(logRequestMiddleware());

  app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
      message: `Welcome toBlog API`,
    });
  });

  return app;
};

export const createNewServer = (): Server => {
  const app = startNewApplication();

  // create db connection
  connectDB();

  const server: Server = {
    app,
    userService: services.newUserStore({ DB: DBObj }),
    postService: services.newPostStore({ DB: DBObj }),
    commentService: services.newCommentStore({ DB: DBObj }),
  };

  // create the express router
  const router = express.Router();

  // mount route
  httpService.postHttpService(server).registerPostRoutes(router);
  httpService.userHttpService(server).registerUserRoutes(router);

  httpService.commentHttpService(server).registerCommentRoutes(router);

  app.use("/api", router);

  logRoutes(app);

  return server;
};
