import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT ?? process.env.Port ?? 3000,
    DB_URI: process.env.DB_URI,
    Access_Token_SECRET: process.env.Access_Token_SECRET,
    Refresh_Token_SECRET: process.env.Refresh_Token_SECRET,
    ImageKit_SECRET_KEY: process.env.ImageKit_SECRET_KEY
}

export default config;
