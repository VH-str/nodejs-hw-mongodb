import { Router } from 'express';

import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  loginUserSchema,
  registerUserSchema,
  resetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import {
  loginUserController,
  registerUserController,
  refreshUserController,
  logoutUserController,
  resetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshUserController));

router.post('/logout', ctrlWrapper(logoutUserController));

router.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  ctrlWrapper(resetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
