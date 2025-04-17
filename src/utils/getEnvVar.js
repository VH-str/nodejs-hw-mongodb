import 'dotenv/config';

export const getEnvVar = (name, defaultValue) => {
  if (name) return process.env[name];
  if (defaultValue) return defaultValue;
  throw new Error(`Missing: process.env['${name}'].`);
};
