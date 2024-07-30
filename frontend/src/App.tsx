import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PostForm from "./components/Posts/PostForm";
import PostDetail from "./components/Posts/PostDetail";
import Layout from "./components/layout/Layout";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import AuthGuard from "./guard/AuthGuard";

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/posts/:postId" element={<PostDetail />} />

          <Route element={<AuthGuard />}>
            <Route path="/posts/new" element={<PostForm />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
