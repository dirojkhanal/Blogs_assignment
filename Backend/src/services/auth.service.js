import bcrypt from "bcrypt";
import AppError from "../utils/appError.js";
import * as authRepo from "../repositories/auth.repository.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.utils.js";

const SALT_ROUNDS = 10;

// REGISTER
export const register = async ({ name, email, password, role }) => {
  // check if email exists
  const existing = await authRepo.findUserByEmail(email);
  if (existing) throw new AppError("Email already exists", 409);

  // hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // create user
  const newUser = await authRepo.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // generate tokens
  const tokens = await generateTokens(newUser);

  // remove password before returning
  const { password: _, ...safeUser } = newUser;

  return {
    user: safeUser,
    ...tokens,
  };
};

// LOGIN
export const login = async ({ email, password }) => {
  const user = await authRepo.findUserByEmail(email);

  const isValidPassword = user
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!user || !isValidPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokens = await generateTokens(user);

  // remove password
  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    ...tokens,
  };
};

// REFRESH TOKEN
export const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token required", 401);
  }

  // verify token
  const decoded = verifyRefreshToken(refreshToken);

  // check if exists in DB
  const storedToken = await authRepo.findRefreshToken(refreshToken);
  if (!storedToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  // check user still exists
  const user = await authRepo.findUserById(decoded.id);
  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  // rotate token (delete old)
  await authRepo.deleteRefreshToken(refreshToken);

  // issue new tokens
  const tokens = await generateTokens(user);

  return tokens;
};

// LOGOUT
export const logout = async (refreshToken) => {
  if (refreshToken) {
    await authRepo.deleteRefreshToken(refreshToken);
  }
};

// PRIVATE HELPER: GENERATE TOKENS
const generateTokens = async (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); 

  await authRepo.saveRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
  };
};