const express = require('express');
const passport = require('passport');
const path = require('path');
const router = express.Router();
const { User } = require('../models/User');
const crypto = require('crypto');
const { check, validationResult } = require('express-validator');
const verifyTokenMiddleware = require('../middleware/auth');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Email verification route
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        // Find the user with the given verification token
        let user = await User.findOne({ verificationToken: token });

        if (!user) {
            console.log('Token not found or expired in DB:', token);
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        // Mark the user as verified
        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();

        res.redirect('/email-verified');
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).send('Server error');
    }
});

// @desc Auth with Google
// @route GET /auth/google
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @desc Google auth callback
// @route GET /auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login.html' }),
    (req, res) => {
        res.redirect('/dashboard.html');
    }
);

// Local login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (!user) {
            return res
                .status(400)
                .json({ message: info.message || 'Invalid credentials' });
        }
        req.logIn(user, async (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Internal Server Error' });
            }
            user.isSignedIn = true;
            await user.save();
            return res.status(200).json({ message: 'Login successful' });
        });
    })(req, res, next);
});

router.post('/admin-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log('Admin not found');
            return res.status(400).send('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).send('Invalid credentials');
        }

        req.login(admin, (err) => {
            if (err) {
                console.log('Error in login:', err);
                return res.status(500).send('Server error');
            }
            res.redirect('/admin-dashboard.html');
        });
    } catch (err) {
        console.log('Server error:', err);
        res.status(500).send('Server error');
    }
});
module.exports = router;

// @desc Register page
// @route GET /register
router.get('/register', (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'register.html'))
);

router.get('/me', (req, res) => {
    const user = req.user; // `req.user` is populated by passport
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        subscriptionPlan: user.subscriptionPlan,
    });
});

router.post('/logout', async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const user = req.user;
            user.isSignedIn = false;
            await user.save();
            req.logout((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/login.html');
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.redirect('/index.html');
    }
});

module.exports = router;
