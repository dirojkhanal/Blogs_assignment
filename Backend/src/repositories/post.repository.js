import { query } from '../db/index.js';

// Create Posts
export const createPost = async ({ authorId, title, content, status }) => {
  const { rows } = await query(
    `INSERT INTO posts (author_id, title, content, status, published_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      authorId,
      title,
      content,
      status,
      status === 'published' ? new Date() : null,
    ]
  );

  return rows[0];
};

// Get all published posts
export const findAllPublished = async ({ limit, offset }) => {
  const { rows } = await query(
    `SELECT
       p.id, p.title, p.content, p.status,
       p.views_count, p.published_at, p.created_at,
       u.id   AS author_id,
       u.name AS author_name
     FROM posts p
     JOIN users u ON u.id = p.author_id
     WHERE p.status = 'published'
     ORDER BY p.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
};

// Count published posts
export const countPublished = async () => {
  const { rows } = await query(
    `SELECT COUNT(*) FROM posts WHERE status = 'published'`
  );
  return parseInt(rows[0].count);
};

// Get single post by ID 
export const findPostById = async (id) => {
  const { rows } = await query(
    `SELECT
       p.*,
       u.name  AS author_name,
       u.email AS author_email
     FROM posts p
     JOIN users u ON u.id = p.author_id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0] || null;
};

// Get own posts
export const findPostsByAuthor = async (authorId) => {
  const { rows } = await query(
    `SELECT * FROM posts
     WHERE author_id = $1
     ORDER BY created_at DESC`,
    [authorId]
  );
  return rows;
};

//Admin: all posts
export const findAllPosts = async ({ limit, offset }) => {
  const { rows } = await query(
    `SELECT
       p.*,
       u.name AS author_name
     FROM posts p
     JOIN users u ON u.id = p.author_id
     ORDER BY p.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
};

export const countAllPosts = async () => {
  const { rows } = await query('SELECT COUNT(*) FROM posts');
  return parseInt(rows[0].count);
};

// Update 
export const updatePost = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return null; // safety

  const setClause = keys
    .map((key, i) => `${key} = $${i + 1}`)
    .join(', ');

  const { rows } = await query(
    `UPDATE posts
     SET ${setClause}, updated_at = NOW()
     WHERE id = $${keys.length + 1}
     RETURNING *`,
    [...values, id]
  );

  return rows[0];
};

// Delete 
export const deletePost = async (id) => {
  await query('DELETE FROM posts WHERE id = $1', [id]);
};

// Views
export const incrementViews = async (id) => {
  await query(
    'UPDATE posts SET views_count = views_count + 1 WHERE id = $1',
    [id]
  );
};