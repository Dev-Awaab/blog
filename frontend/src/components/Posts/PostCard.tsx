import React from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

interface PostProps {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  author: any;
}

const PostCard: React.FC<PostProps> = ({
  _id,
  title,
  content,
  image,
  createdAt,
  author,
}) => {
  return (
    <div className="flex rounded-lg overflow-hidden  mb-4 space-y-3 shadow py-5 px-3">
      <div className="flex-shrink-0">
        <Link to={`/posts/${_id}`}>
          <img className="h-full w-48 object-cover" src={image} alt={title} />
        </Link>
      </div>
      <div className="p-4 flex flex-col justify-between">
        <div>
          <Link to={`/posts/${_id}`}>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
          </Link>
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(content),
            }}
            className="text-gray-700 mb-2 truncate"
          ></p>
        </div>
        <div className="">
          <p className="text-gray-500 mb-6 text-sm space-x-3 ">
            <span className="font-base text-sm">{author.name}</span> •{" "}
            <span>{formatISO9075(new Date(createdAt))}</span>
          </p>
          <Link
            to={`/posts/${_id}`}
            className="bg-black text-white px-3 py-2 rounded "
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
