import createHttpError from 'http-errors';
import {
  deleteContact,
  getAllContacts,
  getContactById,
  patchContact,
  postContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadsDir } from '../utils/saveFileToUploadsDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

  const data = await getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  );

  if (!data.data.length) {
    throw createHttpError(404, 'No contacts found for your request');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const postContactController = async (req, res) => {
  const userId = req.user._id;
  const data = {
    ...req.body,
  };

  const photo = req.file;

  if (photo) {
    if (getEnvVar('USE_CLOUDINARY') === 'true') {
      data.photo = await saveFileToCloudinary(photo);
    } else {
      data.photo = await saveFileToUploadsDir(photo);
    }
  }

  const contact = await postContact(data, userId);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const data = { ...req.body };

  const photo = req.file;

  if (photo) {
    if (getEnvVar('USE_CLOUDINARY') === 'true') {
      data.photo = await saveFileToCloudinary(photo);
    } else {
      data.photo = await saveFileToUploadsDir(photo);
    }
  }

  const result = await patchContact(contactId, data, userId);

  if (!result) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const removedContact = await deleteContact(contactId, userId);

  if (!removedContact) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
};
