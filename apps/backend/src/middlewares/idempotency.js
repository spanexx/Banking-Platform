const { BadRequestError } = require('../utils/errors');

// In-memory cache for demo. Use Redis in production.
const processedRequests = new Map();

exports.idempotencyCheck = (req, res, next) => {
  const idempotencyKey = req.headers['idempotency-key'];
  
  if (!idempotencyKey) {
    throw new BadRequestError('Idempotency key is required');
  }

  const existingResponse = processedRequests.get(idempotencyKey);
  if (existingResponse) {
    return res.status(200).json({
      ...existingResponse,
      cached: true
    });
  }

  // Store the original send function
  const originalSend = res.send;

  // Override the send function to cache the response
  res.send = function(body) {
    processedRequests.set(idempotencyKey, body);
    
    // Clean up old keys after 24 hours
    setTimeout(() => {
      processedRequests.delete(idempotencyKey);
    }, 24 * 60 * 60 * 1000);

    return originalSend.call(this, body);
  };

  next();
};
