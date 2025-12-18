import { Request, Response } from "express";

export class ProductController {

    static createProduct = async (req: Request, res: Response) => {
        try {
            
            res.status(201).send("Product created successfully");
        } catch(error) {
            res.status(500).json({ errors: error })
        }
    }
    
}