const mongoose = require('mongoose');

const package = new mongoose.Schema(
    {
        isPopular: { type: Boolean },
        name: { type: String, enum: [] },
        amount: Number,
        per: { type: String, enum: ['month', 'year'] },
        benefits: [{ isAvaliable: Boolean, name: String }],
    },
    { _id: false } // Prevents automatic creation of _id field for subdocuments
);

module.exports = mongoose.model('Package', package);
