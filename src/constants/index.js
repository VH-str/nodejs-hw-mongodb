import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pathToOneLevelDir = (dir) => {
  return path.join(path.dirname(fileURLToPath(import.meta.url)), '..', dir);
};

export const SORT_VALUES = [
  '_id',
  'name',
  'isFavourite',
  'phoneNumber',
  'email',
  'contactType',
  'createdAt',
  'updatedAt',
];

export const SORT_ORDER = {
  ASC: 'asc',
  DECS: 'desc',
};

export const CONTACT_TYPES = ['work', 'home', 'personal'];

export const FIFTEEN_MINUTES = 15 * 60 * 1000;

export const ONE_DAY = 24 * 60 * 60 * 1000;

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = pathToOneLevelDir('templates');
export const TEMP_UPLOADS_DIR = pathToOneLevelDir('temp');
export const UPLOADS_DIR = pathToOneLevelDir('uploads');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
};
