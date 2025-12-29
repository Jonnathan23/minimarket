import { Router } from 'express';
import { body, param } from 'express-validator';

import { clientExists } from '../clients/middleware/Clients.mid'; // Assuming this exists
import { handleInputErrors } from '../../middleware/handleErrors.mid';


const router = Router();

import { productExists } from '../clients/middleware/Products.mid';
import { SalesController } from './controllers/Sales.controller';
import { saleExists } from './middleware/Sales.mid';
import { authenticate } from '../../middleware/validationHeaders';

// ...

router.param('saleId', saleExists);
router.param('clientId', clientExists);
router.param('productId', productExists);

router.use(authenticate);

// Route: /sale/:clientId/product/:productId
router.post('/sale/:clientId/product/:productId',
    [
        param('clientId').notEmpty().withMessage('Client ID is required'),
        param('productId').notEmpty().withMessage('Product ID is required'),
        // sa_client_id handled by URL
        body('sa_fecha').isISO8601().toDate().withMessage('Date must be valid ISO8601'),
        body('sa_total').isFloat({ gt: 0 }).withMessage('Total must be greater than 0'),
        body('sa_medio_de_pago').notEmpty().withMessage('Payment method is required'),
        body('details').isArray({ min: 1 }).withMessage('Details must be a non-empty array'),
        // sd_product_id removed from body validation
        body('details.*.sd_cantidad').isInt({ gt: 0 }).withMessage('Quantity must be greater than 0'),
        body('details.*.sd_precio_unitario').isFloat({ gt: 0 }).withMessage('Unit price must be greater than 0'),
        handleInputErrors
    ],
    SalesController.create
);

router.get('/', SalesController.getAll);

router.get('/:saleId',
    param('saleId').notEmpty().withMessage('Sale ID is required'),
    handleInputErrors,
    SalesController.getById
);

export default router;