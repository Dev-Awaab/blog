import React, { useEffect, useState } from "react";
import { usePostStore } from "../../store/postStore";
import { getPosts } from "../../services/postService";
import PostCard from "./PostCard";
import Loader from "../Loader";

const PostList: React.FC = () => {
  const { posts, setPosts } = usePostStore();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const data = await getPosts(page);
        const posts = data.data;
        const pagination = data.pagination;

        setPosts(posts);
        setTotalPages(Math.ceil(pagination.total / pagination.size));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [page, setPosts]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 ">
            {posts.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                No Post
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <PostCard key={post._id} {...post} />
                ))}
              </>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:cursor-not-allowed"
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:cursor-not-allowed"
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostList;

