import { CONTACT_TYPES } from '../constants/index.js';

const parseType = (type) => {
  if (typeof type !== 'string') return;
  if (CONTACT_TYPES.includes(type)) return type;
};

const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite !== 'string') return;
  if (isFavourite === 'true') return true;
  if (isFavourite === 'false') return false;
};

export const parseFilterParams = ({ type, isFavourite }) => {
  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
