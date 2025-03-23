const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  action: {
    type: String,
    required: [true, 'Action type is required'],
    enum: ['login', 'transaction', 'profile_update', 'system_event', 'security_change']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Audit details are required']
  },
  ipAddress: {
    type: String,
    trim: true,
    validate: {
      validator: v => validator.isIP(v),
      message: 'Invalid IP address format'
    }
  },
  userAgent: {
    type: String,
    trim: true,
    maxLength: [500, 'User agent too long']
  }
}, {
  timestamps: true,
  strict: false
});

// TTL index for automatic data expiration (2 years)
auditSchema.index({ createdAt: 1 }, { expireAfterSeconds: 63072000 });

// Text index for searching details
auditSchema.index({ details: 'text' });

const Audit = mongoose.model('Audit', auditSchema);
module.exports = Audit;