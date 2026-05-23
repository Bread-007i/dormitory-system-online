const errorMiddleware = (err, req, res, next) => {

  let statusCode =
    res.statusCode === 200
      ? 500
      : res.statusCode;

  let message = err.message;

  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'ไฟล์ใหญ่เกิน 5MB';
  }

  if (err.message?.includes('รองรับเฉพาะ')) {
    statusCode = 400;
  }

  // MySQL Duplicate Entry
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 400;
    message = 'Duplicate entry';
  }

  // MySQL Foreign Key Error
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Referenced record not found';
  }

  res.status(statusCode).json({
    success: false,
    message
  });

};

module.exports = errorMiddleware;