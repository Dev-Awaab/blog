import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../../services/postService";
import { useCommentStore } from "../../store/commentStore";
import { getCommentsForPost } from "../../services/commentService";
import CommentList from "../comments/CommentList";
import CommentForm from "../comments/CommentForm";
import { formatISO9075 } from "date-fns";
import DOMPurify from "dompurify";
import { useAuthStore } from "../../store/authStore";
import Loader from "../Loader";

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<any>(null);
  const { comments, setComments } = useCommentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getPost(postId ?? "");
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    }

    async function fetchComments() {
      try {
        const data = await getCommentsForPost(postId ?? "");
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    }

    fetchPost();
    fetchComments();
  }, [postId, setComments]);

  if (!post) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <div>
        <img src={post.image} alt="" className="my-4" />
        <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>
        <h6 className="text-sm text-gray-500 text-center">
          {formatISO9075(new Date(post.createdAt))}
        </h6>
        <h6 className="text-sm font-semibold text-center">
          {" "}
          By @{post.author.name}
        </h6>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content),
          }}
          className="text-gray-700 mb-4"
        ></p>
        {user ? (
          <>
            <CommentList comments={comments} />
            <CommentForm postId={postId!} />
          </>
        ) : (
          <p className="text-center text-red-500 mt-8">
            Please{" "}
            <a href="/login" className="underline">
              log in
            </a>{" "}
            to view and add comments.
          </p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
