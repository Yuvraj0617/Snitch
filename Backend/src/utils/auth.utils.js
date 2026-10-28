import jwt from 'jsonwebtoken';
import config from '../config/config.js';


const generateAccessToken = (user) => {
    
    return jwt.sign({
        id: user._id, role: user.role
    },
        config.Access_Token_SECRET, { expiresIn: '15m' }
    );

}

const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user._id, role: user.role
    },
        config.Refresh_Token_SECRET, { expiresIn: '7d' }
    );
}

const readRefreshToken = (token) => {
   
    const decoded =  jwt.verify(token, config.Refresh_Token_SECRET)
   
    return decoded
}

const readAccessToken = (accessToken) => {
    return jwt.verify(accessToken, config.Access_Token_SECRET)
}

export { generateAccessToken, generateRefreshToken, readRefreshToken, readAccessToken };