// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    // expose stack only in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
