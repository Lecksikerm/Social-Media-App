const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require("bcrypt");


router.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        const { password, ...userWithoutPassword } = savedUser._doc;

        res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err });
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const { password, ...userWithoutPassword } = user._doc;

        res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err });
    }
});

module.exports = router;

