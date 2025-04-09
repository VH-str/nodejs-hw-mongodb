import { SORT_ORDER } from '../constants/index.js';

import { ContactsCollection } from '../db/models/contact.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
  userId,
) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.countDocuments().merge(contactsQuery),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id, userId) => {
  return await ContactsCollection.findOne({
    _id: id,
    userId,
  });
};

export const postContact = async (payload, userId) => {
  return await ContactsCollection.create({ ...payload, userId });
};

export const patchContact = async (id, payload, userId) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
  };
};

export const deleteContact = async (id, userId) => {
  return ContactsCollection.findOneAndDelete({ _id: id, userId });
};
