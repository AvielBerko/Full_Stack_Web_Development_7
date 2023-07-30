const jwt = require('jsonwebtoken');
const secret = 'tX1f7d&$w3kD7a9JpS@0^cTzB*7sK';
const alg = 'HS256';
const duration = '1h';

function generateJWT(data){
    return jwt.sign(data, secret, { expiresIn: duration, algorithm: alg });
}

function verifyJWT(token){
    try {
        return jwt.verify(token, secret);
      } catch (err) {
        if (err.name === "JsonWebTokenError") {
          return false;
        } else {
          throw err;
        }
    }
}

module.exports = {generateJWT, verifyJWT}
