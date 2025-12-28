import { Router } from 'express';
import { body, param } from 'express-validator';

import { inventoryMovementExists } from './middleware/InventoryMovements.mid';
import { productExists } from '../clients/middleware/Products.mid'; // Import shared middleware
import { handleInputErrors } from '../../middleware/handleErrors.mid';
import { authenticate } from '../../middleware/validationHeaders';
import { InventoryMovementsController } from './controllers/InventoryMovements.controller';

const router = Router();

router.use(authenticate);



router.param('productId', productExists);

router.post('/movement/:productId',
    param('productId').notEmpty().withMessage('Product ID is required'),
    [
        body('im_tipo').isIn(['ENTRADA', 'SALIDA']).withMessage('Type must be ENTRADA or SALIDA'),
        body('im_cantidad').isInt({ gt: 0 }).withMessage('Quantity must be greater than 0'),
        body('im_referencia').notEmpty().withMessage('Reference is required'),
        handleInputErrors
    ],
    InventoryMovementsController.create
);

router.get('/', InventoryMovementsController.getAll);

export default router;
