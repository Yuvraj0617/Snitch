import { Router } from 'express';
import { createUser,loginUser,refresh,logout,getMe} from '../controllers/user.controller.js';
import { RegisterValidationRules,LoginValidationRules } from '../validator/user.validatior.js';
import {authenticate} from '../middlewares/auth.middleware.js';
const router = Router();


// Public routes
router.post('/users', RegisterValidationRules(), createUser);
router.post('/login', LoginValidationRules(), loginUser);
router.post('/refresh-token',  refresh);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
