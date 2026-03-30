CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--USERS
CREATE TABLE IF NOT EXISTS users (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(10)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
--posts
CREATE TABLE IF NOT EXISTS posts (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(500) NOT NULL,
  content      TEXT NOT NULL,
  status       VARCHAR(10) NOT NULL DEFAULT 'draft',
  CHECK (status IN ('draft', 'published')),
  views_count  INTEGER  DEFAULT 0,
  published_at TIMESTAMP,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);
--COMMENTS 
CREATE TABLE IF NOT EXISTS comments (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id     UUID NOT NULL REFERENCES posts(id)  ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

--REFRESH TOKENS
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);
--INDEXES
CREATE INDEX IF NOT EXISTS idx_posts_author  ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_status  ON posts(status);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_refresh_user  ON refresh_tokens(user_id);