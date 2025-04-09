import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, _res, next) => {
  const { contactId } = req.params;
  if (isValidObjectId(contactId)) next();
  else throw createHttpError(400, 'Invalid id. Must be of type ObjectId');
};
