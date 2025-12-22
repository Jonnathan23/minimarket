import { exit } from 'node:process'
import { envs } from '../config';
import { DatabaseConnection } from './db';
import colors from 'colors'
const urlDatabase = envs.NODE_ENV === 'testing'
    ? (envs.DATABASE_TEST_URL || envs.DATABASE_URL)
    : envs.DATABASE_URL;



const clearDB = async () => {
    try {
        const db = new DatabaseConnection({
            urlDatabase: urlDatabase,
            logging: false
        })
        await db.connect(true)
        console.log(colors.yellow.bold('Datos eliminados correctamente'))
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

if (process.argv[2] === '--clear') {
    clearDB()
}