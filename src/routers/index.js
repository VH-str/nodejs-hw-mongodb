import express from 'express';

import contactsRouter from './contacts.js';
import authRouter from './auth.js';

import { UPLOADS_DIR } from '../constants/index.js';

import { swaggerConfig } from '../middlewares/swaggerConfig.js';

const router = express.Router();

router.use('/uploads', express.static(UPLOADS_DIR));
router.use('/api-docs', await swaggerConfig());
router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;
