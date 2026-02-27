// Simple helper to wrap async route handlers and pass errors to next()
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
