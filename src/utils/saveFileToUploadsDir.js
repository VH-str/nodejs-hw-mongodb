import fs from 'node:fs/promises';
import path from 'node:path';
import { TEMP_UPLOADS_DIR, UPLOADS_DIR } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';

export const saveFileToUploadsDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOADS_DIR, file.filename),
    path.join(UPLOADS_DIR, file.filename),
  );
  return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
};
