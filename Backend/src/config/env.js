import dotenv from 'dotenv';

dotenv.config();

const required = [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'JWT_ACCESS_EXPIRES',
    'JWT_REFRESH_EXPIRES',
    // 'CLIENT_URL',

];

//fail if any required env variable is missing
required.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required env variable: ${key}`);
    }
});

export const config = {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    db:{url:process.env.DATABASE_URL},
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES,
    },
    // clientUrl: process.env.CLIENT_URL,

};