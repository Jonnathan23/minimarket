import colors from 'colors'
import server from "./server";
import { envs } from './config';


const port = envs.PORT

server.listen(port, () => {
    console.log(colors.cyan.bold(`Res api en el pueto ${port}`))
})