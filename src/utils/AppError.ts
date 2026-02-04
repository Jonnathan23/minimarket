export class AppError extends Error {

    public readonly statusCode: number;
    public readonly errors: { msg: string; path?: string }[];

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        
        this.errors = [{ msg: message }];
        
        Object.setPrototypeOf(this, new.target.prototype);
    }
}