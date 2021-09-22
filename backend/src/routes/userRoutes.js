import express from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

//user routes

router
  .route('/register')
  .post(protect, superAdminAuth, userController.createUser);
router.route('/login').post(userController.authUser);

export default router;
