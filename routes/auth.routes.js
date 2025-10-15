import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/auth/login', authController.login);

router.post('/auth/register', authController.register);

export default router;