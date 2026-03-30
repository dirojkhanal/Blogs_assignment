import { verifyAccessToken } from '../utils/jwt.utils.js';
import { findUserById }  from '../repositories/auth.repository.js';
import AppError from '../utils/appError.js';


// checks if user is logged in
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('You are not logged in', 401));
  }
  const token   = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token); 

  const user = await findUserById(decoded.id);
  if (!user) return next(new AppError('User no longer exists', 401));

  req.user = user; 
  next();
};

// checks if user has the right role
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to do this', 403));
  }
  next();
};