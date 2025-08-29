import dotenv from 'dotenv';

dotenv.config();

interface IEnvVars {
    PORT: string;
    DB_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
}

const loadEnvVars = (): IEnvVars => {
    const requiredEnvVariables = ['PORT', 'DB_URL', 'NODE_ENV'];

    requiredEnvVariables.forEach((varName) => {
        if (!process.env[varName]) {
            throw new Error(`Environment variable ${varName} is not set.`);
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
    }

}
export const envVars = loadEnvVars();