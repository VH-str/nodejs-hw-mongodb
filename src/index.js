import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { TEMP_UPLOADS_DIR, UPLOADS_DIR } from './constants/index.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';

const bootstrap = async () => {
  try {
    await initMongoConnection();
    await createDirIfNotExists(TEMP_UPLOADS_DIR);
    await createDirIfNotExists(UPLOADS_DIR);
    setupServer();
  } catch (e) {
    console.log('Error during setup', e);
  }
};

bootstrap();
