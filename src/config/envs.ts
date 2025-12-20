import { get } from "env-var"

process.loadEnvFile()


export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    DATABASE_URL: get('DATABASE_URL').required().asString(),
    JWT_SEED: get('JWT_SEED').required().asString(),
    //NODE_ENV: get('NODE_ENV').required().asString(),
    //JWT_SECRET: get('JWT_SECRET').required().asString(),
    //FRONTEND_URL: get('FRONTEND_URL').required().asString(),
    //SWAGGER_URL: get('SWAGGER_URL').required().asString(),
    DEVELOPMENT: process.argv[2] ?? '',
    IS_LOCAL_DATABASE: process.argv[3] ?? '',
}