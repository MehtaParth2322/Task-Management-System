const jwt = require('jsonwebtoken');
const User = require('../model/user');
const ApiResponse = require("../utils/ApiResponse");
const { generateAccessToken } = require("../utils/functions");
const config = require("../utils/config");

const verifyToken = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken && !refreshToken) {
        return res.status(401).json(
            new ApiResponse(401, {}, "Access or Refresh token is required")
        );
    }

    try {
        if (accessToken) {
            const decodedToken = jwt.verify(accessToken, config.accessTokenJWT.secret);
            const user = await User.findById(decodedToken._id);

            if (!user) {
                return res.status(404).json(
                    new ApiResponse(404, {}, "User not found with provided Access Token")
                );
            }
            req.user = user;
            next();
            return;
        }
        // if Refresh Token is given
        const decodedToken = jwt.verify(refreshToken, config.refreshTokenJWT.secret);
        const user = await User.findById(decodedToken._id);
        if (!user) {
            return res.status(404).json(
                new ApiResponse(404, {}, "User not found with provided Refresh Token")
            );
        }
        const newAccessToken = await generateAccessToken(user._id);

        const accessTokenCookieOptions = {
            ...config.cookieOptions,
            maxAge: config.accessTokenMaxAge
        };

        req.user = user;
        res.status(200).cookie("accessToken", newAccessToken, accessTokenCookieOptions);

        next();
    } catch (error) {
        console.log("error: ", error);
        return res.status(401).json(
            new ApiResponse(401, {}, "Invalid or Expired Access or Refresh Token")
        );
    }
};

module.exports = verifyToken;