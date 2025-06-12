import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // For password hashing

// Define the Vendor Schema
const vendorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'], // Added from your version
      maxLength: [50, 'Full name cannot exceed 50 characters'] // Updated max length from your version
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Ensures email addresses are unique
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // Basic email regex validation
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true, // Ensures phone numbers are unique
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number'], // Added from your version
      maxLength: [20, 'Phone number cannot exceed 20 characters']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Exclude password from query results by default (retained)
    },
    profilePicture: {
      type: String, // Store path to the uploaded profile picture
      default: null
    },
    isGoogleSignup: { // Added from your version
      type: Boolean,
      default: false
    },
    registrationStatus: { // Added from your version
      type: String,
      enum: ['pending', 'completed', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically (retained for conciseness)
  }
);

// Mongoose pre-save hook to hash the password before saving a new vendor or modifying password
vendorSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  try {
    // Hash password with a cost factor of 12 (updated from your version)
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error); // Pass any hashing error to the next middleware
  }
});

// Method to compare entered password with hashed password in the database
vendorSchema.methods.comparePassword = async function (enteredPassword) {
  // 'this.password' needs to be explicitly selected in a query if 'select: false' is used
  // e.g., Vendor.findById(id).select('+password')
  return await bcrypt.compare(enteredPassword, this.password);
};


// Create the Vendor Model
const Vendor = mongoose.model('Vendor', vendorSchema);

// Export the Vendor Model for use in other files
export default Vendor;
