const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Define the schema for the Users collection
const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.statics.toAPI = (doc) => ({
    email: doc.email,
    _id: doc._id,
});

// Helper function to hash a password
userSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

// Authenticate function
userSchema.statics.authenticate = async (email, password) => {
    const user = await User.findOne({ email }).exec();
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        return user;
    } else {
        throw new Error('Password is incorrect');
    }
};

// Create a Mongoose model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
