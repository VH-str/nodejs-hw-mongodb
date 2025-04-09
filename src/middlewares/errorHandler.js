import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, _) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.statusCode,
      message: err.name,
      data: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
