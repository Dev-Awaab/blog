import { AuditTrail } from "./custom";

export interface User extends AuditTrail {
  _id: string;
  name: string;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

export type UserCreate = Pick<User, "name" | "email" | "password">;
export type UserGet = Pick<User, "email">;

export interface UserTokenPayload {
  email: string;
  id: string;
}

export interface UserService {
  create(data: UserCreate): Promise<User>;
  get(data: UserGet): Promise<User>;
}
