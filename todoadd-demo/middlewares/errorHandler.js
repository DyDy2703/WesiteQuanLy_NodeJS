// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || {}).join(", ");
    return res.status(409).json({
      success: false,
      message: fields ? `${fields} already exists` : "Duplicate key error",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message || "Validation error",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field: ${err.path}`,
    });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    // expose stack only in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
