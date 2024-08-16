const mongoose = require('mongoose');
const { Package, Duration } = require('../enums/Package');

const allowedPackages = [
    Package.Free,
    Package.BasicMonthly,
    Package.CreatorMonthly,
    Package.PremiumMonthly,
    Package.BasicYearly,
    Package.CreatorYearly,
    Package.PremiumYearly,
];

const allowedDurations = [
    Duration.Monthly,
    Duration.Yearly,
    Duration.Unlimited
]


const package = new mongoose.Schema(
    {
        isPopular: { type: Boolean },
        name: { type: String, enum: allowedPackages },
        amount: {type: Number, default: 0},
        per: { type: String, enum: allowedDurations },
        benefits: [{ isAvaliable: Boolean, name: String }],
    },
    { timestamps: true } // Prevents automatic creation of _id field for subdocuments
);

module.exports = mongoose.model('Package', package);
