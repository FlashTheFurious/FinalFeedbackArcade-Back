const User = require('../models/user-schema');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { full_name, email,password } = req.body;
        console.log(req.body, "body")

        const hash = await User.generateHash(password);
        const newUser = new User({ full_name, email, password: hash });
    
        await newUser.save();
        req.session.account = User.toAPI(newUser);
        
        return res.status(201).json({ redirect: '/login' });

    } catch (error) {

        console.error(error.message);
        res.status(500).send(error.message);
    }
};

// Controller to handle user login
exports.login = async (req, res) => {
    try {
        console.log(req.body, "body");
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
          }

          const user = await User.authenticate(email, password);
          console.log(user, "user");
          const userData = User.toAPI(user);
        
          console.log(userData, "account");

        //   return res.json({ userId: userData._id });
          return res.json({ user });

    } catch (error) {

        res.status(500).json({ error: error.message });
    }
};

// Controller to handle forgot password
exports.validateUser = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if the email exists in the database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Email not found' });
        }

        // If user found, send 'User found' response
        return res.status(200).json({ message: 'User found' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.updatePassword = async (req, res) => {
    try {

        // Extract email and new password from request body
        const { email, password } = req.body;

        // Check if email and new password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and new password are required' });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate hash of the new password
        const hash = await User.generateHash(password);

        // Update user's password with the hashed password
        user.password = hash;

        // Save the updated user to the database
        await user.save();

        // Send success response
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};