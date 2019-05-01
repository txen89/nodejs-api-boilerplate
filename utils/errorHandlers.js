exports.validationErrorHandler = next => result => {
  if (result.isEmpty()) return;
  const error = new Error("Error");
  error.status = 500;
  error.message = "Error";
  error.info = result.array();
  if (!next) {
    throw error;
  } else {
    return next(error);
  }
};

exports.mainErrorHandler = (err, status) => {
  const error = new Error("Error");
  error.status = status || 500;
  error.message = "Error";
  error.info = err;
  throw error;
};
