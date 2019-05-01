module.exports = (error, req, res, next) => {
  let status = error.status || 500;
  let errorMsg = error.message;
  let errorInfo = error.info;
  res.status(status).json({ success: false, error: errorMsg, info: errorInfo });
};
