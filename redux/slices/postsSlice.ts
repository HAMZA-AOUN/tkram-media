import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Post } from "@/types/post";

interface PostsState {
  posts: Post[];
  post: Post;
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  post: {
    id: -1,
    userId: -1,
    title: "",
    body: "",
    comments: [],
  },
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await fetch("/api/posts");
  return res.json();
});

export const fetchPost = createAsyncThunk(
  "posts/fetchPost",
  async (postId: number) => {
    const res = await fetch(`/api/posts/${postId}`);
    return res.json();
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (newPost: Post) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    if (!res.ok) {
      throw new Error("Failed to create post");
    }
    console.log("post created ");
    alert("post created ");

    return res.json();
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (updatedPost: Post) => {
    const res = await fetch(`/api/posts/${updatedPost.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPost),
    });

    if (!res.ok) {
      throw new Error("Failed to update post");
    }
    console.log("post updated ");
    alert("post updated ");

    return res.json();
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: number) => {
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (!res.ok) {
      throw new Error("Failed to delete post");
    }
    console.log("post deleted ");
    alert("post deleted ");
    return postId;
  }
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId: number) => {
    const res = await fetch(`/api/posts/${postId}/comments`);
    return { postId, comments: await res.json() };
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.map((post: Post) => ({
          ...post,
          comments: [],
        }));
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) {
          post.comments = action.payload.comments;
        }
      });
  },
});

export default postsSlice.reducer;
