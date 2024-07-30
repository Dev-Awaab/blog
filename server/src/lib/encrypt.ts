import jwt from "jsonwebtoken";
import config from "../config";

export const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, config.jwtSecrect as string, {
    expiresIn: "30d",
  });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, config.jwtSecrect as string, {
    expiresIn: "7d",
  });
};
