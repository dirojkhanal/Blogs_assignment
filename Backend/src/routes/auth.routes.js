import { Router }          from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate }        from '../middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema
} from '../validators/auth.validator.js';


const router = Router();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login',validate(loginSchema), authController.login);
router.post('/refresh',  authController.refresh);
router.post('/logout',authController.logout);

export default router;