import express from 'express';
import {
  register,
  login,
  verifyOtp,
  resendOtp,
  saveName,
  saveZip,
} from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/name', saveName);
router.post('/resend-otp', resendOtp);
router.post('/zip', saveZip);

export default router;
