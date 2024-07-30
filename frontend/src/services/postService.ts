import axios from "axios";

import { PaginationResponse } from "./custom";

interface Post {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

axios.defaults.baseURL = "http://localhost:3000/api";

const userString = localStorage.getItem("token") ?? "";
console.log(userString);
const userToken = userString ? JSON.parse(userString) : null;

export const getPosts = async (
  page: number = 1
): Promise<PaginationResponse<Post>> => {
  const response = await axios.get(`/posts?page=${page}`);

  return response.data.data;
};

export const getPost = async (postId: string): Promise<Post> => {
  const response = await axios.get(`/posts/${postId}`);
  return response.data.data;
};

export const createPost = async (data: {
  title: string;
  content: string;
  image?: string;
}): Promise<Post> => {
  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };
  const response = await axios.post("/posts", data, config);
  return response.data;
};
