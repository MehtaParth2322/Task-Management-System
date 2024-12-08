const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ApiResponse = require("../utils/ApiResponse");
const User = require("../model/user");
const { generateAccessToken, generateRefereshToken } = require("../utils/functions");
const config = require("../utils/config");

/**
 *  @description Get User by Token
 *  @method GET
 */
exports.getUserByToken = (req, res) => {
    const userId = req.user._id;

    User.findById(userId)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Not found user with Id: " + userId })
            } else {
                data.password = undefined;
                res.status(200).send(new ApiResponse(200, data, "Request Successfull"))
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while finding a user with Id: " + userId
            })
        })
}


/**
 *  @description Register User
 *  @method POST
 */
exports.register = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    const existedUser = await User.findOne({ email: req.body.email })

    if (existedUser) {
        return res.status(409).json(new ApiResponse(409, {}, "This email address has already been registered"));
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    const newUser = new User({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
    });

    newUser.save()
        .then(data => {
            data = {
                _id: data._id,
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email
            }
            return res.status(201).json(
                new ApiResponse(201, data, "User registered Successfully")
            );
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while creating a user"
            })
        })
}

/**
 *  @description Confirm Register User
 *  @method POST
 */

exports.confirmRegister = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

}

/**
 *  @description Login User
 *  @method POST
 */
exports.login = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    const { email, password } = req.body;

    User.findOne({ email })
        .then(async (user) => {
            if (!user) {
                return res.status(401).json(new ApiResponse(401, {}, "Invalid email or password"));
            }
            else {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    const newAccessToken = await generateAccessToken(user._id);
                    const newRefreshToken = await generateRefereshToken(user._id);
                    data = {
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken
                    };

                    const accessTokenCookieOptions = {
                        ...config.cookieOptions,
                        maxAge: config.accessTokenMaxAge
                    };

                    const refreshTokenCookieOptions = {
                        ...config.cookieOptions,
                        httpOnly: true,
                        maxAge: config.refreshTokenMaxAge
                    }

                    return res.status(200)
                        .cookie("accessToken", newAccessToken, accessTokenCookieOptions)
                        .cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)
                        .json(new ApiResponse(200, data, "User logged In Successfully"));
                } else
                    return res.status(401).json(new ApiResponse(401, {}, "Invalid email or password"));
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error while login a user"
            })
        })
}


/**
 *  @description Logout User
 *  @method DELETE
 */
exports.logout = (req, res) => {
    return res
        .status(200)
        .clearCookie("accessToken", config.cookieOptions)
        .clearCookie("refreshToken", config.cookieOptions)
        .json(new ApiResponse(200, {}, "User logged Out"))
}

/**
 *  @description Get a new Access Token
 *  @method POST
 */
exports.refreshAccessToken = async (req, res) => {
    console.log("refreshAccessToken", req.cookies);
    const oldRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!oldRefreshToken) {
        return res.status(401).json(new ApiResponse(401, [], "Refresh token is required"));
    }

    try {
        const decodedToken = jwt.verify(oldRefreshToken, config.refreshTokenJWT.secret);

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            return res.status(404).json(new ApiResponse(404, [], "Data not found with provided Refresh Token"));
        }

        const newAccessToken = await generateAccessToken(user._id);

        const accessTokenCookieOptions = {
            ...config.cookieOptions,
            maxAge: config.accessTokenMaxAge
        };

        return res.status(200)
            .cookie("accessToken", newAccessToken, accessTokenCookieOptions)
            .json(new ApiResponse(200, { newAccessToken }, "Access token refreshed"));
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error while refreshing a access token"
        })
    }
}