import listEndpoints from "express-list-endpoints";
import clc from "cli-color";
import { Application } from "../types";

const logRoutes = (app: Application) => {
  const endpoints = listEndpoints(app);

  endpoints.forEach((endpoint) => {
    endpoint.methods.forEach((method) => {
      console.log(
        clc.cyan(
          `Registered route: [${clc.blue(method)}] ${clc.yellow(endpoint.path)}`
        )
      );
    });
  });
};

export default logRoutes;
