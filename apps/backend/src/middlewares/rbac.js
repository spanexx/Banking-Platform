const { ForbiddenError } = require('../utils/errors');

exports.rbac = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.customer) {
      throw new ForbiddenError('Access denied - authentication required');
    }

    const hasRole = allowedRoles.includes(req.customer.role);
    if (!hasRole) {
      throw new ForbiddenError('Access denied - insufficient permissions');
    }

    next();
  };
};
