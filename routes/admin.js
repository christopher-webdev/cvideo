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

// Change admin password
router.post('/adminChangePassword', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Got here with email: ${email}, password: ${password}`);
    try {
        // Check if admin exists
        let admin = await Admin.findOne({ email });
        if (!admin) {
            console.log('Admin account does not exist.');
            return res.status(400).json({
                msg: 'Admin account does not exist.',
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update admin password
        admin.password = hashedPassword;

        // Save the updated admin
        await admin.save();

        console.log('Admin Password Reset Successful');
        res.send('Admin Password Reset Successful');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// adminRoutes.js
router.get('/admins', async (req, res) => {
    try {
        const admins = await Admin.find({}, '_id email isSuperuser');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// DELETE /api/admins/:id - Delete an admin
router.delete('/admins/:id', async (req, res) => {
    try {
        const adminId = req.params.id;
        await Admin.findByIdAndDelete(adminId);
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
