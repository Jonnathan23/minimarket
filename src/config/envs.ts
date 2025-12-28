import { get } from "env-var"
import dotenv from "dotenv"

// Load env file only if not in test environment (test env is loaded by jest.env.setup.cjs)
if (process.env.NODE_ENV !== 'test') {
    dotenv.config()
}


export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    NODE_ENV: get('NODE_ENV').default('development').asString(),
    DATABASE_URL: get('DATABASE_URL').required().asString(),
    DATABASE_TEST_URL: get('DATABASE_TEST_URL').asString(),
    JWT_SEED: get('JWT_SEED').required().asString(),    
    FRONTEND_URL: get('FRONTEND_URL').required().asString(),
    SWAGGER_URL: get('SWAGGER_URL').required().asString(),
    DEVELOPMENT: process.argv[2] ?? ''
}