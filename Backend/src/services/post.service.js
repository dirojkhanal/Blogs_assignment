import  AppError from '../utils/AppError.js';
import * as postRepo from '../repositories/post.repository.js';

// Create 
export const createPost = async (authorId, body) => {
  const { title, content, status } = body;
  return postRepo.createPost({ authorId, title, content, status });
};

//  Get all published
export const getAllPosts = async (page = 1, limit = 10) => {
  const safePage  = Math.max(1, parseInt(page)  || 1);
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit) || 10));
  const offset    = (safePage - 1) * safeLimit;

  const [posts, total] = await Promise.all([
    postRepo.findAllPublished({ limit: safeLimit, offset }),
    postRepo.countPublished(),
  ]);

  return {
    posts,
    pagination: {
      total,
      page:       safePage,
      limit:      safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      hasNext:    safePage < Math.ceil(total / safeLimit),
      hasPrev:    safePage > 1,
    },
  };
};

//  Get single post by ID 
export const getPostById = async (id) => {
  const post = await postRepo.findPostById(id);
  if (!post) throw new AppError('Post not found', 404);

  postRepo.incrementViews(id).catch(() => {}); // fire and forget
  return post;
};

// Get my own posts
export const getMyPosts = async (authorId) => {
  return postRepo.findPostsByAuthor(authorId);
};

// Update 
export const updatePost = async (postId, userId, body) => {
  const post = await postRepo.findPostById(postId);
  if (!post) throw new AppError('Post not found', 404);

  // only the owner can edit
  if (post.author_id !== userId) {
    throw new AppError('You can only edit your own posts', 403);
  }

  const fields = {};
  if (body.title)   fields.title   = body.title;
  if (body.content) fields.content = body.content;
  if (body.status)  {
    fields.status = body.status;
    if (body.status === 'published' && post.status === 'draft') {
      fields.published_at = new Date();
    }
  }

  return postRepo.updatePost(postId, fields);
};

// Delete 
export const deletePost = async (postId, userId, userRole) => {
  const post = await postRepo.findPostById(postId);
  if (!post) throw new AppError('Post not found', 404);

  // owner OR admin can delete - this is the core RBAC requirement
  if (post.author_id !== userId && userRole !== 'admin') {
    throw new AppError('You do not have permission to delete this post', 403);
  }

  await postRepo.deletePost(postId);
};

//Admin: all posts
export const adminGetAllPosts = async (page = 1, limit = 10) => {
  const safePage  = Math.max(1, parseInt(page)  || 1);
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit) || 10));
  const offset    = (safePage - 1) * safeLimit;

  const [posts, total] = await Promise.all([
    postRepo.findAllPosts({ limit: safeLimit, offset }),
    postRepo.countAllPosts(),
  ]);

  return {
    posts,
    pagination: {
      total,
      page:       safePage,
      limit:      safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};