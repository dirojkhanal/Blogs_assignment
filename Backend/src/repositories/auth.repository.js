import {query} from '../db/index.js';

export const findUserByEmail = async (email) => {
    const {rows} = await query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
};

export const findUserById = async (id) => {
    const {rows} = await query('SELECT id , name , email , role, created_at FROM users WHERE id = $1', [id]);
    return rows[0] || null;
};

export const createUser = async ({name , email , password , role}) => {
    const {rows} = await query(`INSERT INTO users (name , email, password ,role) VALUES ($1 ,$2,$3,$4) RETURNING id , name,email, role, created_at`, [name , email , password , role]);
    return rows[0];
};

//Refresh Token
export const saveRefreshToken = async ({ userId, token, expiresAt }) => {
  await query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );
};

export const findRefreshToken = async (token) => {
  const { rows } = await query(
    `SELECT * FROM refresh_tokens
     WHERE token = $1 AND expires_at > NOW()`,
    [token]
  );
  return rows[0] || null;
};

export const deleteRefreshToken = async (token) => {
  await query(
    'DELETE FROM refresh_tokens WHERE token = $1',
    [token]
  );
};
export const deleteAllUserTokens = async (userId) => {
  await query(
    'DELETE FROM refresh_tokens WHERE user_id = $1',
    [userId]
  );
};