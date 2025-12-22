import { envs } from "../config";
import { DatabaseConnection } from "../data";


const urlDatabase = envs.NODE_ENV === 'testing'
    ? (envs.DATABASE_TEST_URL || envs.DATABASE_URL)
    : envs.DATABASE_URL;

describe('connect DB', () => {
    it('should handle database connection error', async () => {
        const db = new DatabaseConnection({
            urlDatabase: urlDatabase,
            logging: false
        })

        // Mock the authenticate method to throw an error
        jest.spyOn(db.getConnection(), 'authenticate').mockRejectedValueOnce(new Error('Error al conectar a la BD'))
        const consoleSpy = jest.spyOn(console, 'log')

        await db.connect()

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error al conectar a la BD'))
    })
})