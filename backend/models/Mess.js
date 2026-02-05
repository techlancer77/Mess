import mongoose from 'mongoose';

/**
 * MESS MODEL
 * Schema Only - NO business logic
 * Represents mess/tiffin services with geolocation
 */

const messSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MessOwner',
    required: true,
    index: true
  },
  // GeoJSON for location-based queries
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  menu: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
      required: true
    },
    isVeg: {
      type: Boolean,
      required: true
    },
    description: String
  }],
  photos: [{
    type: String // URLs
  }],
  timings: {
    open: {
      type: String,
      required: true // Format: "08:00"
    },
    close: {
      type: String,
      required: true // Format: "22:00"
    }
  },
  priceRange: {
    min: {
      type: Number,
      required: true,
      min: 0
    },
    max: {
      type: Number,
      required: true,
      min: 0
    }
  },
  availableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  // Approval workflow
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
    index: true
  },
  rejectionReason: String,
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  // Calculated fields (updated by service layer)
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  isVegOnly: {
    type: Boolean,
    default: false
  },
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Geospatial index for nearby queries
messSchema.index({ location: '2dsphere' });

// Compound indexes for filtering
messSchema.index({ status: 1, averageRating: -1 });
messSchema.index({ status: 1, 'priceRange.min': 1 });
messSchema.index({ status: 1, isVegOnly: 1 });

const Mess = mongoose.model('Mess', messSchema);

export default Mess;