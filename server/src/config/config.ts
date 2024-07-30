import "dotenv/config";
import { NODE_ENV } from "../types/enums";

export interface Config {
  port: number;
  nodeEnv: NODE_ENV;
  databaseUrl: string;
  jwtSecrect: string;
}

export const getConfig = (): Config => {
  const required: string[] = ["NODE_ENV", "DATABASE_URL"];

  if (!process.env.CI) {
    // Do not require this check in CI
    required.forEach((variable) => {
      if (!process.env[variable]) throw new Error(`${variable} env not set`);
    });
  }

  return {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: (process.env.NODE_ENV as NODE_ENV) || NODE_ENV.DEVELOPMENT,
    databaseUrl: process.env.DATABASE_URL || "",
    jwtSecrect: process.env.JWT_REFRESH_SECRET,
  };
};
