import React from "react";

const CommentList: React.FC<{ comments: any[] }> = ({ comments }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      <ul className="space-y-4">
        {comments?.map((comment) => (
          <li key={comment._id} className="flex items-start space-x-1">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
                {comment.author.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold">
                    {comment.author.name}
                  </h4>
                  <time className="text-gray-500 text-sm">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p className="text-gray-700 mt-2">{comment.content}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
