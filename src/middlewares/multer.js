import multer from 'multer';
import { TEMP_UPLOADS_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, TEMP_UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const prefix = Date.now();
    cb(null, `${prefix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
