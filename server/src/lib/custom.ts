import Joi, { ObjectSchema } from "joi";
import {
  CommentCreate,
  PaginationParam,
  PaginationResponse,
  PostCreate,
  PostUpdate,
  UserCreate,
} from "../types";
import {
  NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGHT,
  PASSWORD_MIN_LENGHT,
} from "../constants";

export function generateRandomString(
  options: { length: number } = { length: 10 }
) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < options.length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function paginate<T>(
  total: number,
  filter: PaginationParam,
  data: T[]
): PaginationResponse<T> {
  const { page = 1, limit = 10 } = filter;

  const next = (page - 1) * limit + data.length < total ? page + 1 : null;
  const previous = page > 1 ? page - 1 : null;

  return {
    pagination: {
      total,
      size: limit,
      current_page: page,
      next: next ? { page: next, size: limit } : null,
      previous: previous ? { page: previous, size: limit } : null,
    },
    data,
  };
}

export function validateSchema<T>(
  schema: ObjectSchema<T>,
  body: any,
  opts: any = {}
): { error?: string; value?: T } {
  const { error, value } = schema.validate(body, {
    abortEarly: false,
    allowUnknown: opts.allowUnknown || false,
  });

  if (error) {
    let [
      {
        message: errorMessage,
        type: errorType,
        context: { key },
      },
    ] = error.details;

    if (errorType === "any.required") errorMessage = `${key} is required`;

    if (errorType === "object.unknown") {
      errorMessage = `Unknown/Unexpected parameter: '${error.details[0].context.key}'`;
    }

    return { error: errorMessage };
  }

  return { value };
}

type CreateUserSchema = Pick<UserCreate, "name" | "email" | "password">;
export const createUserSchema: ObjectSchema<CreateUserSchema> = Joi.object({
  name: Joi.string().max(NAME_MAX_LENGTH).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGHT)
    .max(PASSWORD_MAX_LENGHT)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
    }),
});

type LoginUserSchema = Pick<UserCreate, "email" | "password">;
export const loginUserSchema: ObjectSchema<LoginUserSchema> = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGHT)
    .max(PASSWORD_MAX_LENGHT)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
    }),
});

type CreatePostSchema = Pick<PostCreate, "title" | "content" | "image">;

export const postCreateSchema: ObjectSchema<CreatePostSchema> =
  Joi.object<PostCreate>({
    title: Joi.string().min(3).max(255).required(),
    content: Joi.string().min(10).required(),
    image: Joi.string().uri().optional(),
  });

export type PostUpdateSchema = Partial<
  Pick<PostUpdate, "title" | "content" | "image">
>;
export const postUpdateSchema: ObjectSchema<PostUpdateSchema> =
  Joi.object<PostUpdate>({
    title: Joi.string().min(3).max(255).optional(),
    content: Joi.string().min(10).optional(),
    image: Joi.string().uri().optional(),
  });

export type CommentCreateSchema = Pick<CommentCreate, "content" | "post">;
export const commentCreateSchema = Joi.object<CommentCreateSchema>({
  content: Joi.string().min(1).required(),
  post: Joi.string().required(),
});
