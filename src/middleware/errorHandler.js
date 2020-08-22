const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    });
  } else if (error.name === 'ValidationError') {
    return response.status(401).json({ error: 'There was a validation error' });
  } else if (error.name === 'UnauthorizedError') {
    return response
      .status(403)
      .json({ success: false, message: 'No token provided.' });
  } else if (error.name === 'TypeError') {
    console.log('Yahtzee!');
  }

  next(error);
};

module.exports = errorHandler;
