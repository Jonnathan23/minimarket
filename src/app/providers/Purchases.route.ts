import { Router } from 'express';
import { body, param } from 'express-validator';
import { PurchasesController } from './controllers/Purchases.controller';
import { purchaseExists } from './middleware/Purchases.mid';
import { providerExists } from './middleware/Providers.mid';
import { handleInputErrors } from '../../middleware/handleErrors.mid';
import { authenticate } from '../../middleware/validationHeaders';

const router = Router();

import { productExists } from '../clients/middleware/Products.mid';

// ...

router.param('purchaseId', purchaseExists);
router.param('providerId', providerExists);
router.param('productId', productExists);

router.use(authenticate);

// Route: /purchase/:providerId/product/:productId
router.post('/purchase/:providerId/product/:productId',
    [
        param('providerId').notEmpty().withMessage('Provider ID is required'),
        param('productId').notEmpty().withMessage('Product ID is required'),
        body('pu_fecha').isISO8601().toDate().withMessage('Date must be valid ISO8601'),
        body('pu_total').isFloat({ gt: 0 }).withMessage('Total must be greater than 0'),
        body('details').isArray().withMessage('Details must be an array'),
        // pd_product_id removed from body validation as it matches the URL param
        body('details.*.pd_cantidad').isInt({ gt: 0 }).withMessage('Quantity must be greater than 0'),
        body('details.*.pd_precio_unitario').isFloat({ gt: 0 }).withMessage('Unit price must be greater than 0'),
        handleInputErrors
    ],
    PurchasesController.create
);

router.get('/', PurchasesController.getAll);

router.get('/:purchaseId',
    param('purchaseId').notEmpty().withMessage('Purchase ID is required'),
    handleInputErrors,
    PurchasesController.getById
);

export default router;
