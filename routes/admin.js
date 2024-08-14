// routes/admin.js
const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { User } = require('../models/User');
const { SubscriptionPlan } = require('../models/User');
const router = express.Router();

// Serve the admin registration page
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin-register.html'));
});

// Create a new admin account
router.post('/register', async (req, res) => {
    const { email, password, isSuperuser } = req.body;

    try {
        // Check if admin already exists
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).send('Admin already exists');
        }

        // Create new admin
        admin = new Admin({
            email,
            password: await bcrypt.hash(password, 10),
            isSuperuser,
        });

        await admin.save();
        res.send('Admin created');
    } catch (err) {
        res.status(500).send('Server error');
    }
});
module.exports = router;
