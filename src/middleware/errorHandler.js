const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    });
  }

  next(error);
};

module.exports = errorHandler;
