import cors from 'cors'
import express from "express";
import morgan from 'morgan';
import { envs, CorsConfig } from './config';
import { DatabaseConnection } from './data';
import router from './router';


const db = new DatabaseConnection({
    ulrDatabase: envs.DATABASE_URL,
    logging: false//envs.NODE_ENV === 'development'
})

db.connect()

const server = express();
/*
const corsOptions = {
    FRONTEND_URL: envs.FRONTEND_URL,
    argv_2: envs.argv_2,
    argv_3: envs.argv_3,
    SWAGGER_URL: envs.SWAGGER_URL,
    NODE_ENV: envs.NODE_ENV
}

const corsConfig = new CorsConfig(corsOptions).corsOptions

server.use(cors(corsConfig))*/
server.use(express.json())
server.use(morgan('dev'))


//Routes
server.use('/api', router)

export default server;