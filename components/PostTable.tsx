// what to show in the posts table : userId id title body comments update delete and in the above create post button

// I will fetch this url to get the posts info (https://jsonplaceholder.typicode.com/posts)

// when click in the update post button I will fetch this url (https://jsonplaceholder.typicode.com/posts/1) to show
// the post info and update only what I want .

// I will fetch this url to show the comments that related to
// specific post (https://jsonplaceholder.typicode.com/posts/1/comments)

"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchPosts,
  fetchComments,
  deletePost,
} from "@/redux/slices/postsSlice";
import { MdEdit, MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import CreatePost from "./CreatePost";
import UpdatePost from "./UpdatePost";
import { Post } from "@/types/post";

const PostsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector((state) => state.posts);
  const [expandedComments, setExpandedComments] = useState<number | null>(null);
  const [isCommentsLoad, setIsCommentsLoad] = useState<number | null>(null);
  const [isCreatePostOn, setIsCreatePostOn] = useState<boolean>(false);
  const [isUpdatPostOn, setIsUpdatePostOn] = useState<boolean>(false);
  const [postToUpdate, setPostToUpdate] = useState<Post>({
    id: -1,
    userId: -1,
    title: "",
    body: "",
    comments: [],
  });

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const loadComments = (postId: number) => {
    dispatch(fetchComments(postId));
    setIsCommentsLoad(postId);
    setExpandedComments(null);
  };

  const toggleComments = (postId: number) => {
    if (expandedComments === postId) {
      setExpandedComments(null); // Collapse comments if already expanded
    } else {
      setExpandedComments(postId); // Expand comments for the selected post
    }
  };

  const handleEditPost = (post: Post) => {
    setPostToUpdate(post);
    setIsUpdatePostOn(true); // Show the update popup
  };

  const handleDelete = (id: number) => {
    dispatch(deletePost(id));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="relative flex flex-col">
      {/* Popup Create Post */}
      {isCreatePostOn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setIsCreatePostOn(false)}
            >
              ✕
            </button>
            <CreatePost />
          </div>
        </div>
      )}
      {/* Popup Update Post */}
      {isUpdatPostOn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setIsUpdatePostOn(false)}
            >
              ✕
            </button>
            <UpdatePost post={postToUpdate} />
          </div>
        </div>
      )}

      {/* Create Post Button */}
      <button
        className="flex w-fit px-5 py-2 items-center justify-start gap-4 my-4 
        rounded-xl ring-1 ring-blue-400 font-semibold hover:bg-blue-400 hover:text-white
        transition-all duration-400 ease-in-out"
        onClick={() => setIsCreatePostOn(true)}
      >
        Create Post <FiPlus />
      </button>

      <div className="h-[1px] w-full bg-gray-300" />
      <h1 className="my-4 flex w-fit items-center justify-start text-3xl font-bold text-gray-700">
        OUR POSTS
      </h1>
      <div className="h-[1px] w-full bg-gray-300 mb-4" />

      {/* Posts Table */}
      <div className="flex bg-gray-50 px-4 rounded-2xl shadow-lg">
        <table className="min-w-full text-gray-700 md:table">
          <thead className="text-left text-sm">
            <tr>
              <th className="md:whitespace-nowrap py-4 pl-3 font-bold text-gray-600 lg:text-lg">
                User Id
              </th>
              <th className="py-4 md:px-3 font-bold text-gray-600 lg:text-lg">
                Id
              </th>
              <th className="py-4 font-bold md:px-3 text-gray-600 lg:text-lg">
                Title
              </th>
              <th className="py-4 px-2 font-bold text-gray-600 lg:text-lg">
                Body
              </th>
              <th className="hidden lg:flex py-4 font-bold text-gray-600 lg:text-lg">
                Comments
              </th>
              <th className="py-4 px-2 font-bold text-gray-600 lg:text-lg">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {posts.map((post) => (
              <tr
                key={post.id}
                className="w-full border-b py-3 text-sm last-of-type:border-none"
              >
                <td className="pl-6">{post.userId}</td>
                <td className="lg:px-3 py-4">{post.id}</td>
                <td className="lg:px-3 py-4 font-semibold">{post.title}</td>
                <td className="px-2 lg:px-3 py-4 lg:text-[15px]">
                  {post.body}
                </td>
                <td className="hidden lg:flex py-4">
                  {!isCommentsLoad && (
                    <button
                      onClick={() => loadComments(post.id)}
                      className="text-[11px] hover:text-blue-600 font-semibold transition-all
                        duration-500 ease-in-out text-blue-300"
                    >
                      Load
                      <br /> Comments
                    </button>
                  )}
                  {post.id === isCommentsLoad && (
                    <ul className="relative px-2">
                      {isCommentsLoad && (
                        <button
                          className="absolute -top-3 right-5 text-[12px] hover:text-red-600 font-semibold transition-all
                            duration-500 ease-in-out text-red-300"
                          onClick={() => setIsCommentsLoad(null)}
                        >
                          exit
                        </button>
                      )}
                      {isCommentsLoad &&
                        (expandedComments === post.id
                          ? post.comments.map((comment, index) => (
                              <li key={comment.id} className="py-1 text-sm">
                                <span className="font-semibold">
                                  {index + 1} -
                                </span>{" "}
                                {comment.body}
                              </li>
                            ))
                          : post.comments.slice(0, 1).map((comment, index) => (
                              <li key={comment.id} className="py-1 text-sm">
                                <span className="font-semibold">
                                  {index + 1} -
                                </span>{" "}
                                {comment.body}
                              </li>
                            )))}
                      {isCommentsLoad && (
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="text-[11px] hover:text-blue-600 font-semibold transition-all
                            duration-500 ease-in-out text-blue-300 mt-2"
                        >
                          {expandedComments === post.id
                            ? "See Less"
                            : "See More"}
                        </button>
                      )}
                    </ul>
                  )}
                </td>
                <td>
                  <div className="flex flex-col lg:flex-row  gap-3 pr-6">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="text-gray-600 ring-1 ring-gray-400 p-1 rounded-sm outline-none"
                    >
                      <MdEdit className="hover:scale-125 transition-all w-full duration-500 ease-in-out" />
                    </button>
                    <button
                      onClick={() => {}}
                      className="text-red-600 ring-1 ring-red-400 p-1 rounded-sm outline-none"
                    >
                      <MdDelete
                        onClick={() => handleDelete(post.id)}
                        className="hover:scale-125 w-full transition-all duration-500 ease-in-out"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostsTable;
