import React, { useState } from "react";
import { useCommentStore } from "../../store/commentStore";
import {
  createComment,
  getCommentsForPost,
} from "../../services/commentService";
import toast from "react-hot-toast";

const CommentForm: React.FC<{ postId: string }> = ({ postId }) => {
  const [content, setContent] = useState("");
  const { setComments } = useCommentStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createComment({ content, post: postId });
      const updatedComments = await getCommentsForPost(postId);
      setComments(updatedComments);
      setContent("");
      toast.success("success");
    } catch (error: any) {
      console.error("Failed to create comment:", error);
      toast.error(error.response.data.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="content" className="sr-only">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Write a comment..."
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? "Loading..." : "Comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
