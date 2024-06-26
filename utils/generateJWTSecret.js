// This file must be executed by Node.js to generate a random JWT_SECRET (JWT_SECRET is required to generate a JWT (Bearer) token)

const crypto = require('crypto');

const generateJWTSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

console.log(generateJWTSecret());