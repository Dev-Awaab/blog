import { User, UserCreate, UserGet, UserService } from "../types/user";
import { DBObj } from "../models";

export interface UserStore {
  DB: typeof DBObj;
}

export function newUserStore(u: UserStore): UserService {
  async function create(data: UserCreate): Promise<User> {
    return (await u.DB.User.create({ ...data })) as unknown as User;
  }

  async function get(data: UserGet): Promise<User> {
    return await u.DB.User.findOne({ email: data.email });
  }

  return {
    create,
    get,
  };
}
