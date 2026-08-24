export function errorHandler(err, req, res, next) {
  const isUploadLimitError =
    typeof err.code === "string" && err.code.startsWith("LIMIT_");
  const statusCode =
    err.statusCode ||
    (isUploadLimitError ? 400 : null) ||
    (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: err.code ? { code: err.code } : undefined,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}
