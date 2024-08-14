const { User } = require('../models/User');

module.exports = {
    async getUserById(id) {
        try {
            const user = await User.findById(id).select(
                '-password -resetPasswordToken -resetPasswordExpires'
            );

            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {this.createError("Unable to fetch user")}
    },

    createError(message = 'Internal Error', statusCode = 500) {
        const err = new Error(message);
        err.status = statusCode;
        err.message = 'Something went wrong';
        console.log('🚀 ~ error:', message);

        throw err;
    },
};

