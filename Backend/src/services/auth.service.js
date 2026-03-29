import bcrypt from 'bcrypt';
import AppError from '../utils/appError.js';
import * as authRepo from '../repositories/auth.repository.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.utils.js';
// import {query} from '../db/index.js';

const SALT_ROUNDS = 10;

export const register = async ({name , email ,password ,role}) => {
    // Check if the email already exists
    const existing = await authRepo.findUserByEmail(email);
    if(existing) throw new AppError('Email already exists', 409);

    // Hash the password
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    // Create the user
    const user = await authRepo.createUser({
        name,
        email,
        password: hashed,
        role
    });

    //issue token so than user is logged in immediately after registration
    const tokens= await generateTokens(user);
    return {user, ...tokens};

};

//private helper 
const generateTokens = async (user) => {
  const payload = {
    id:    user.id,
    email: user.email,
    role:  user.role,
  };

  const accessToken  = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await authRepo.saveRefreshToken({
    userId: user.id,
    token:  refreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken };
};