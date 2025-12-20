import jwt, { SignOptions } from 'jsonwebtoken';
import { envs } from '../config';


const JWT_SEED = envs.JWT_SEED

export class JwtAdapter {
    static async generateToken(payload: Object, duration: SignOptions['expiresIn'] = '2h'): Promise<string | null> {
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
                console.log(err);
                if (err) return resolve(null);

                console.log(token);
                resolve(token!);
            })
        })
    }

    static validateToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SEED, (error, decoded) => {
                if (error) return resolve(null);

                resolve(decoded as T);
            })
        })
    }
}