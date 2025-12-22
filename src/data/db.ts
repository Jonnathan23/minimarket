import { Sequelize } from "sequelize-typescript";
import colors from 'colors'

interface Options {
    urlDatabase: string
    logging?: boolean
}

export class DatabaseConnection {

    private readonly db: Sequelize

    constructor(options: Options) {
        const { urlDatabase, logging = false } = options

        const db = new Sequelize(urlDatabase, {
            models: [__dirname + '/models/**/*.model.{ts,js}'],
            logging: logging
        })

        this.db = db
    }

    async connect(force: boolean = false) {
        try {
            await this.db.authenticate()
            await this.db.sync({ force })
            console.log(colors.blue.bold('Conexion exitosa a la BD'))
        } catch (error) {
            console.log(colors.red.bold('Error al conectar a la BD'))
            console.log(error)
        }
    }

    async disconnect() {
        await this.db.close()
    }

    getConnection() {
        return this.db
    }

}