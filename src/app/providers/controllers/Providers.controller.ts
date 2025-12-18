import { Request, Response } from 'express';
import Providers from '../../../data/models/providers/Providers.model';

export class ProvidersController {

    static async getAll(req: Request, res: Response) {
        try {
            const providers = await Providers.findAll();
            res.json(providers);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const provider = await Providers.create(req.body);
            res.status(201).json(provider);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const provider = req.provider!;
            await provider.update(req.body);
            res.json(provider);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const provider = req.provider!;
            await provider.destroy();
            res.json({ message: 'Provider deleted' });
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            res.json(req.provider);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }
}
