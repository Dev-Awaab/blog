import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  access_token?: any;
}

interface AuthResponse {
  user: User;
  token: string;
}

axios.defaults.baseURL = "http://localhost:3000/api";

export const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await axios.post("/users/login", data);
  localStorage.setItem(
    "token",
    JSON.stringify(response.data.data.access_token)
  );
  localStorage.setItem("user", JSON.stringify(response.data.data));
  return response.data;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await axios.post("/users", data);
  localStorage.setItem(
    "token",
    JSON.stringify(response.data.data.access_token)
  );
  localStorage.setItem("user", JSON.stringify(response.data.data));
  return response.data;
};
