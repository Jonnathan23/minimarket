import colors from 'colors'
import server, { db } from "./server";
import { envs } from './config';


const port = envs.PORT

async function main() {
    console.log(colors.yellow(`Iniciando el servidor`))
    try {
        await db.connect();
        server.listen(port, () => {
            console.log(colors.cyan.bold(`Res api en el pueto ${port}`))
        })
    } catch (error) {

    }
}


main();