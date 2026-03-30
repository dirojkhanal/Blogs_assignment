import bcrypt from "bcrypt";
import AppError from "../utils/appError.js";
import * as authRepo from "../repositories/auth.repository.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.utils.js";
// import {query} from '../db/index.js';

const SALT_ROUNDS = 10;

export const register = async ({ name, email, password, role }) => {
  // Check if the email already exists
  const existing = await authRepo.findUserByEmail(email);
  if (existing) throw new AppError("Email already exists", 409);

  // Hash the password
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  // Create the user
  const user = await authRepo.createUser({
    name,
    email,
    password: hashed,
    role,
  });

  //issue token so than user is logged in immediately after registration
  const tokens = await generateTokens(user);
  return { user, ...tokens };
};

export const login = async ({ email, password }) => {
  //find user by email
  const user = await authRepo.findUserByEmail(email);
  // checks if user exists and password is correct
  const isValidPassword = user
    ? await bcrypt.compare(password, user.password)
    : false;
  if (!user || !isValidPassword)
    throw new AppError("Invalid email or password", 401);
  //generate tokens
  const tokens = await generateTokens(user);
  //return user without password
  const { password: _, ...safeUser } = user;
  return { safeUser, ...tokens };
};
// Refresh token 
export const refresh = async (refreshToken) => {
  if (!refreshToken) throw new AppError("Refresh token required", 401);

  // verify signature
  const decoded = verifyRefreshToken(refreshToken);

  // check it exists in DB (not logged out)
  const stored = await authRepo.findRefreshToken(refreshToken);
  if (!stored) throw new AppError("Invalid refresh token", 401);

  //check user still exists
  const user = await authRepo.findUserById(decoded.id);
  if (!user) throw new AppError("User no longer exists", 401);

  // rotate — delete old token, issue fresh pair
  await authRepo.deleteRefreshToken(refreshToken);
  const tokens = await generateTokens(user);
  return tokens;
};

// Logout 
export const logout = async (refreshToken) => {
  if (refreshToken) {
    await authRepo.deleteRefreshToken(refreshToken);
  }
};

//private helper
const generateTokens = async (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await authRepo.saveRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken };
};
