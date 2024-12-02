"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createPost } from "@/redux/slices/postsSlice";

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [body, setBody] = useState<string>("");
  const { error } = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (id !== 0)
        await dispatch(
          createPost({
            userId: 1,
            id,
            title,
            body,
            comments: [],
          })
        ).unwrap();

      setId(0);
      setTitle("");
      setBody("");
    } catch (err: unknown) {
      console.error("Failed to create post:", err);
    }
  };

  return (
    <div>
      <h1 className="flex my-4  text-3xl font-bold text-gray-900">
        Create a Post
      </h1>
      <div className="h-[1px] w-full bg-gray-300 mb-4" />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start justify-between gap-4  bg-gray-100 rounded-xl p-4 shadow-md"
      >
        <div className="flex w-full">
          <input
            className="bg-gray-50 outline-none rounded-xl p-3 w-full text-lg ring-1 ring-gray-200 shadow-sm"
            type="number"
            id="id"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex w-full">
          <input
            className="bg-gray-50 outline-none rounded-xl p-3 w-full text-lg ring-1 ring-gray-200 shadow-sm"
            type="text"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex w-full">
          <textarea
            className="bg-gray-50 p-3 w-full outline-none ring-1 ring-gray-200 rounded-xl shadow-sm"
            id="body"
            value={body}
            placeholder="Body"
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button
          className="flex w-fit px-5 py-2 items-center justify-start gap-4 my-4 
        rounded-xl ring-1 ring-gray-300 font-semibold hover:bg-blue-400 hover:text-white
        transition-all duration-400 ease-in-out"
          onClick={() => {}}
        >
          Create Post
        </button>
      </form>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default CreatePost;
