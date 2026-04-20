const sendResponse = (res, statusCode, data, message) => {
  const payload = {
    success: statusCode >= 200 && statusCode < 300,
    message: message || undefined,
  };
  if (data !== undefined && data !== null) {
    payload.data = data;
    if (Array.isArray(data)) payload.count = data.length;
  }
  return res.status(statusCode).json(payload);
};

module.exports = sendResponse;
