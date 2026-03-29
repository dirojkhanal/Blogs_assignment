import * as authService from '../services/auth.service.js';

const COOKIE_OPTIONS = {    
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const register = async (req, res) => {
    const {user , accessToken, refreshToken} = await authService.register(req.body);
    res.cookie('refreshToken', refreshToken,COOKIE_OPTIONS);
    res.status(201).json({
        status: 'success',
        data: {
            user,
            accessToken
        }
    })
};