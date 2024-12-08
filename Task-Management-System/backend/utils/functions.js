const jwt = require('jsonwebtoken');
const User = require('../model/user');
const config = require('./config');

const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const newAccessToken = jwt.sign(
            {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            },
            config.accessTokenJWT.secret,
            { expiresIn: config.accessTokenJWT.expiresIn }
        );
        return newAccessToken;
    } catch (error) {
        console.log("Error while generating access token")
    }
}

const generateRefereshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const newRefreshToken = jwt.sign(
            { _id: user._id },
            config.refreshTokenJWT.secret,
            { expiresIn: config.refreshTokenJWT.expiresIn }
        );
        return newRefreshToken;
    } catch (error) {
        console.log("Error while generating referesh token")
    }
}

module.exports = { generateAccessToken, generateRefereshToken };