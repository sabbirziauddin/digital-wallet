import dotenv from 'dotenv';

dotenv.config();

interface IEnvVars {
    PORT: string;
    DB_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
    JWT_SECRET: string;
    JWT_EXPIRED_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRED_IN: string;
    BCRYPT_SALT_ROUNDS: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;

}

const loadEnvVars = (): IEnvVars => {
    const requiredEnvVariables = ['PORT', 'DB_URL', 'NODE_ENV', 'JWT_SECRET', 'JWT_EXPIRED_IN', 'JWT_REFRESH_SECRET', 'JWT_REFRESH_EXPIRED_IN', 'BCRYPT_SALT_ROUNDS', 'SUPER_ADMIN_EMAIL', 'SUPER_ADMIN_PASSWORD'];

    requiredEnvVariables.forEach((varName) => {
        if (!process.env[varName]) {
            throw new Error(`Environment variable ${varName} is not set.`);
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRED_IN: process.env.JWT_EXPIRED_IN as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRED_IN: process.env.JWT_REFRESH_EXPIRED_IN as string,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,   
    }

}
export const envVars = loadEnvVars();