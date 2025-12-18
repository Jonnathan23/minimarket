import { Router } from "express";
import { ProductController } from "./Product.controller";


export const productRoute = Router();


productRoute.post('/product', ProductController.createProduct);

