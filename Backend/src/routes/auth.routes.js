import { Router }          from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate }        from '../middlewares/validate.middleware.js';
import { protect }         from '../middlewares/auth.middleware.js';
import {
  registerSchema,
  loginSchema
} from '../validators/auth.validator.js';
import { login } from '../services/auth.service.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login',validate(loginSchema), authController.login);


export default router;