import axios from "axios";

interface Comment {
  _id: string;
  content: string;
  author: string;
  post: string;
  createdAt: string;
  updatedAt: string;
}

axios.defaults.baseURL = "http://localhost:3000/api";

const userString = localStorage.getItem("token");
const userToken = userString ? JSON.parse(userString) : null;

export const getCommentsForPost = async (
  postId: string
): Promise<Comment[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };
  const response = await axios.get(`/comments/post/${postId}`, config);
  return response.data.data;
};

export const createComment = async (data: {
  content: string;
  post: string;
}): Promise<Comment> => {
  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };
  const response = await axios.post("/comments", data, config);
  return response.data;
};
