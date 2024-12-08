exports.cookieOptions = {
    domain: "localhost",
    sameSite: "none",
    secure: true
};

exports.accessTokenMaxAge = 10*1000;  // 1 * 24 * 60 * 60 * 1000;

exports.refreshTokenMaxAge = 40*1000; // 7 * 24 * 60 * 60 * 1000;

// JWT Secret keys
exports.accessTokenJWT = {
    secret: "ACCESS@SECRET@KEY",
    expiresIn: "1d"
}

exports.refreshTokenJWT = {
    secret: "REFRESH@SECRET@KEY",
    expiresIn: "7d"
}
