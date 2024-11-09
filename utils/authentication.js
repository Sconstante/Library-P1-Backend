const jwt = require('jsonwebtoken');
require('dotenv').config();

const keyJWT = process.env.JWT_KEY;

const tokenVerification = async (req, res, next) => {
    const authorization = req.headers["authorization"];
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Without authentication' });
    }

    try {
        const decodedToken = jwt.verify(token, keyJWT);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid authentication token' });
    }
};

const createToken = async (tokenData) => {
    return jwt.sign(tokenData, keyJWT, {expiresIn: '30d'});
};

module.exports = {
    tokenVerification,
    createToken
};