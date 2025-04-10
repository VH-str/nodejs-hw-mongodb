import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import handlebars from 'handlebars';

import {
  FIFTEEN_MINUTES,
  ONE_DAY,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/index.js';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });
};

const createSessionData = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(401, 'User not found');

  const isPasswordEqual = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordEqual) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.deleteOne({ userId: user._id });

  const sessionData = createSessionData();

  return await SessionsCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const refreshUser = async ({ sessionId, refreshToken }) => {
  const currentSession = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!currentSession) throw createHttpError(401, 'Session not found');

  const isRefreshTokenExpired =
    new Date() > new Date(currentSession.refreshTokenValidUntil);

  if (isRefreshTokenExpired)
    throw createHttpError(401, 'Session token expired');

  const sessionData = createSessionData();

  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  return await SessionsCollection.create({
    userId: currentSession.userId,
    ...sessionData,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found!');

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '15m' },
  );

  const templatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');
  const templateString = (await fs.readFile(templatePath)).toString();
  const result = handlebars.compile(templateString);
  const html = result({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendMail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let data;
  try {
    data = jwt.verify(token, getEnvVar('JWT_SECRET'));
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UsersCollection.findOne({
    _id: data.sub,
    email: data.email,
  });
  if (!user) throw createHttpError(404, 'User not found!');

  const hashedPassword = await bcrypt.hash(password, 10);

  await UsersCollection.findOneAndUpdate(
    {
      _id: user._id,
    },
    { password: hashedPassword },
  );
  await SessionsCollection.findOneAndDelete({ userId: user._id });
};
