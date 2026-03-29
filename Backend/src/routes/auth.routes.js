import { Router }          from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate }        from '../middlewares/validate.middleware.js';
// import { protect }         from '../middlewares/auth.middleware.js';
import {
  registerSchema,
} from '../validators/auth.validator.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), authController.register);


export default router;