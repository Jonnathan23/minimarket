import cors from 'cors'
import express from "express";
import morgan from 'morgan';
import { envs, CorsConfig } from './config';
import { DatabaseConnection } from './data';
import router from './router';
import { Documentacion } from './config/swagger';
import { globalErrorHandler } from './middleware/globalErrorHandler';

const urlDatabase = envs.NODE_ENV === 'testing'
    ? (envs.DATABASE_TEST_URL || envs.DATABASE_URL)
    : envs.DATABASE_URL;

const db = new DatabaseConnection({
    urlDatabase: urlDatabase,
    logging: false
})

//db.connect()

const server = express();


const corsOptions = {
    FRONTEND_URL: envs.FRONTEND_URL,
    argv_2: envs.DEVELOPMENT,
    SWAGGER_URL: envs.SWAGGER_URL,
    NODE_ENV: envs.NODE_ENV
}

const corsConfig = new CorsConfig(corsOptions).corsOptions

server.use(cors(corsConfig))
server.use(express.json())
server.use(morgan('dev'))


//Routes
server.use('/api', router)


//Errors
server.use(globalErrorHandler)

//Documentation
const documentacion = new Documentacion()

server.use('/docs', documentacion.serve, documentacion.setup())

export { db }
export default server;