const Customer = require('../models/Customer');
const { NotFoundError, ForbiddenError, BadRequestError, ConflictError } = require('../utils/errors');

exports.getProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer.id);
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // Prevent password update through this route
    if (req.body.password) {
      throw new ForbiddenError('Cannot update password through this route');
    }

    // Prevent role update through this route
    if (req.body.role) {
      throw new ForbiddenError('Cannot update role through this route');
    }

    // Check if email is being changed and is unique
    if (req.body.email && req.body.email !== req.customer.email) {
      const existingCustomer = await Customer.findOne({ email: req.body.email });
      if (existingCustomer) {
        throw new ConflictError('Email already in use');
      }
    }

    const customer = await Customer.findByIdAndUpdate(
      req.customer.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find()
      .select('-password')
      .sort('lastName');
    
    res.json(customers);
  } catch (err) {
    next(err);
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .select('-password');
    
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    // Prevent certain fields from being updated
    const restrictedFields = ['password', 'passwordResetToken', 'passwordResetExpires'];
    const hasRestrictedFields = restrictedFields.some(field => field in req.body);
    
    if (hasRestrictedFields) {
      throw new ForbiddenError('Cannot update restricted fields');
    }

    if (req.body.email) {
      const existingCustomer = await Customer.findOne({ 
        email: req.body.email,
        _id: { $ne: req.params.id }
      });
      if (existingCustomer) {
        throw new ConflictError('Email already in use');
      }
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
