const mongoose = require('mongoose');
const { createWebhooks } = require('../functions/helpers');
const getEnv = require('./env');

const connectDB = async () => {
    try {
        // Local MongoDB URI
        await mongoose.connect('mongodb://localhost:27017/cluster1', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });

        if (getEnv('ENV') !== 'development') {
            await createWebhooks(getEnv("WEBHOOK.PAYPAL"));
            // await createWebhooks(getEnv("WEBHOOKS.STRIPE"));
        }

        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
module.exports = connectDB;

// module.exports = connectDB;

// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         await mongoose.connect('mongodb+srv://cvideoai:QY0qJ5MWylfMSaon@cluster0.rgfg6vi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             serverSelectionTimeoutMS: 5000
//         });
//         console.log('MongoDB connected');
//     } catch (err) {
//         console.error(err.message);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;
