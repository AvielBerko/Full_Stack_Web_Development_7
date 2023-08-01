const jwt = require('jsonwebtoken');
const config = require('./jwt_config.js');

function generateJWT(data) {
    return jwt.sign(data, config.SECRET, { expiresIn: config.DURATION, algorithm: config.ALG });
}

function verifyJWT(token) {
    try {
        return jwt.verify(token, config.SECRET);
    } catch (err) {
        return false;
    }
}

module.exports = { generateJWT, verifyJWT }
