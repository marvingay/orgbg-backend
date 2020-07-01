const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    });
  } else if (error.name === 'ValidationError') {
    return response.status(401).json({ error: error.message });
  }

  next(error);
};

module.exports = errorHandler;
