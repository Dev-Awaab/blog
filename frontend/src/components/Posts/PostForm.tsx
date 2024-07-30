import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { createPost } from "../../services/postService";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PostForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [image, setImage] = useState<any>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(true);

  const uploadImage = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "wdudgcc6");
    data.append("cloud_name", "dgfdgi5hf");
    data.append("folder", "blog");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dgfdgi5hf/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const res = await response.json();
      console.log("res", res);
      setUrl(res.secure_url);
      setLoading(false);
      return res.secure_url;
    } catch (error) {
      setLoading(false);
    }
  };

  console.log(url);

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setImage(file);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await uploadImage().then(async (res) => {
        await createPost({
          title,
          content,
          image: res,
        });
        navigate("/");
      });
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen mt-10">
      <div className="w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new post
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md  -space-y-px">
            <div>
              <label htmlFor="title" className="sr-only">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Title"
              />
            </div>
            <div>
              <input
                id="hidden-input"
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
              <label htmlFor="hidden-input" className="cursor-pointer">
                <div className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                  {image ? image.name : "Upload an image"}
                </div>
              </label>
            </div>
            <div>
              <label htmlFor="content" className="sr-only">
                Content
              </label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="rounded-none h-[300px] relative block w-full border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Content"
                style={{ height: "400px" }}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading
                ? "Uploading image"
                : creating
                ? "creating post"
                : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
