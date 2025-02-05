import { createSlice } from '@reduxjs/toolkit';

import blogPostService from '../services/blogs';

const blogPostSlice = createSlice({
  name: 'blogPosts',
  initialState: [],
  reducers: {
    setBlogPosts(state, action) {
      return action.payload;
    },
    appendBlogPost(state, action) {
      state.push(action.payload);
    },
    updateBlogPosts(state, action) {
      const newBlogPost = action.payload;
      const updatedBlogPosts = state.map((blogPost) =>
        blogPost.id === newBlogPost.id ? newBlogPost : blogPost
      );
      return updatedBlogPosts;
    },
    deleteBlogPost(state, action) {
      const id = action.payload;
      const updatedState = state.filter((blogPost) => blogPost.id !== id);
      return updatedState;
    },
  },
});

export const { setBlogPosts, appendBlogPost, updateBlogPosts, deleteBlogPost } =
  blogPostSlice.actions;

export function initializeBlogPosts() {
  return async (dispatch) => {
    let blogPosts = await blogPostService.getAll();
    blogPosts = blogPosts.sort((a, b) => b.likes - a.likes);
    dispatch(setBlogPosts(blogPosts));
  };
}

export function addBlogPost(newBlogPost) {
  return async (dispatch) => {
    const blogPost = await blogPostService.saveBlog(newBlogPost);
    dispatch(appendBlogPost(blogPost));
  };
}

export function updateBlogPost(blogPost) {
  return async (dispatch) => {
    const blogPostUpdated = { ...blogPost, likes: blogPost.likes + 1 };
    await blogPostService.updateBlog(blogPostUpdated);
    dispatch(updateBlogPosts(blogPostUpdated));
  };
}

export function deletePost(blogPost) {
  return async (dispatch) => {
    const id = blogPost.id;
    await blogPostService.deleteBlog(id);
    dispatch(deleteBlogPost(id));
  };
}

export default blogPostSlice.reducer;
