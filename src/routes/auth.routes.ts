import { authLoginValidationSchema, authRegisterValidationSchema } from '@kitchensathi12-arch/ecommerce-types';
import express, { Router } from 'express';

// ~  --------------------- local imports start here ---------------------------
import { getLoggedInUser, loginUser, registerUser, verifyEmail, resendOtp, logout, loginWithGoogle } from '@/controller/auth.controller';
import { authMiddleware } from '@/middleware/Authorization';
import { Validator } from '@/utils/validator';

export const AuthRouter = (): Router => {
  const router: Router = express.Router();

  // **************************************
  //  ~ public routes start here.
  // **************************************
  router.post('/register', Validator(authRegisterValidationSchema), registerUser);
  router.post('/login', Validator(authLoginValidationSchema), loginUser);
  router.post('/resend-otp', resendOtp);
  router.post("/login-with-google",loginWithGoogle)

  // **************************************
  // ~ private and protected routes start here.
  // **************************************
  router.get('/logged-in-user', authMiddleware, getLoggedInUser);
  router.post('/logout', authMiddleware, logout)
  router.post('/verify-email', authMiddleware, verifyEmail);

  return router;
};
