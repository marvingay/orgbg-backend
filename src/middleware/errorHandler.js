const errorHandler = (error, _req, _res, next) => {
  console.log(error.message);

  next(error);
};

module.exports = errorHandler;
