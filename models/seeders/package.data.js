const { Package: EPackage, Duration } = require('../../enums/Package');

module.exports = [
    {
        id: 1,
        isPopular: false,
        name: EPackage.Free,
        amount: 40,
        per: Duration.Unlimited,
        benefits: [
            { isAvailable: true, name: 'Lorem ipsum' },
            { isAvailable: true, name: 'Lorem ipsum' },
            { isAvailable: false, name: 'Lorem ipsum' },
        ],
    },
    {
        id: 2,
        isPopular: true,
        name: EPackage.BasicMonthly,
        amount: 60,
        per: Duration.Monthly,
        benefits: [
            { isAvailable: true, name: 'Dolor sit amet' },
            { isAvailable: true, name: 'Consectetur adipiscing' },
            { isAvailable: true, name: 'Elit sed do' },
            { isAvailable: false, name: 'Eiusmod tempor' },
        ],
    },
    {
        id: 3,
        isPopular: false,
        name: EPackage.BasicYearly,
        amount: 50,
        per: Duration.Yearly,
        benefits: [
            { isAvailable: true, name: 'Incididunt ut' },
            { isAvailable: false, name: 'Labore et dolore' },
            { isAvailable: true, name: 'Magna aliqua' },
        ],
    },
    // {
    //     id: 4,
    //     isPopular: true,
    //     name: EPackage.CreatorMonthly,
    //     amount: 80,
    //     per: Duration.Monthly,
    //     benefits: [
    //         { isAvailable: true, name: 'Ut enim ad' },
    //         { isAvailable: true, name: 'Minim veniam' },
    //         { isAvailable: true, name: 'Quis nostrud' },
    //         { isAvailable: true, name: 'Exercitation ullamco' },
    //     ],
    // },
    // {
    //     id: 5,
    //     isPopular: true,
    //     name: EPackage.CreatorYearly,
    //     amount: 80,
    //     per: Duration.Yearly,
    //     benefits: [
    //         { isAvailable: true, name: 'Ut enim ad' },
    //         { isAvailable: true, name: 'Minim veniam' },
    //         { isAvailable: true, name: 'Quis nostrud' },
    //         { isAvailable: true, name: 'Exercitation ullamco' },
    //     ],
    // },
    // {
    //     id: 6,
    //     isPopular: true,
    //     name: EPackage.PremiumMonthly,
    //     amount: 80,
    //     per: Duration.Monthly,
    //     benefits: [
    //         { isAvailable: true, name: 'Ut enim ad' },
    //         { isAvailable: true, name: 'Minim veniam' },
    //         { isAvailable: true, name: 'Quis nostrud' },
    //         { isAvailable: true, name: 'Exercitation ullamco' },
    //     ],
    // },
    // {
    //     id: 7,
    //     isPopular: true,
    //     name: EPackage.PremiumYearly,
    //     amount: 80,
    //     per: Duration.Yearly,
    //     benefits: [
    //         { isAvailable: true, name: 'Ut enim ad' },
    //         { isAvailable: true, name: 'Minim veniam' },
    //         { isAvailable: true, name: 'Quis nostrud' },
    //         { isAvailable: true, name: 'Exercitation ullamco' },
    //     ],
    // },
];
