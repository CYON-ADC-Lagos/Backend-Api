const sendResponse = (res, success, statusCode, data, message) => {
  return res.status(statusCode).json({
    success,
    message,
    count: data && data.length > 1 ? data.length : undefined,
    data: data ? data : undefined,
  });
};

module.exports = sendResponse;
