import * as postService from '../services/post.service.js';

export const createPost = async (req, res) => {
  const post = await postService.createPost(req.user.id, req.body);
  res.status(201).json({ status: 'success', data: { post } });
};

export const getAllPosts = async (req, res) => {
  const result = await postService.getAllPosts(req.query.page, req.query.limit);
  res.status(200).json({ status: 'success', data: result });
};

export const getPostById = async (req, res) => {
  const post = await postService.getPostById(req.params.id);
  res.status(200).json({ status: 'success', data: { post } });
};

export const getMyPosts = async (req, res) => {
  const posts = await postService.getMyPosts(req.user.id);
  res.status(200).json({ status: 'success', data: { posts } });
};

export const updatePost = async (req, res) => {
  const post = await postService.updatePost(
    req.params.id,
    req.user.id,
    req.body
  );
  res.status(200).json({ status: 'success', data: { post } });
};

export const deletePost = async (req, res) => {
  await postService.deletePost(req.params.id, req.user.id, req.user.role);
  res.status(200).json({ status: 'success', message: 'Post deleted' });
};

export const adminGetAllPosts = async (req, res) => {
  const result = await postService.adminGetAllPosts(req.query.page, req.query.limit);
  res.status(200).json({ status: 'success', data: result });
};