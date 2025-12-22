import { Router } from 'express';
import { body } from 'express-validator';
import { ProductsController } from './controllers/Products.controller';
import { productExists } from './middleware/Products.mid';
import { categoryExists } from './middleware/Categories.mid';
import { handleInputErrors } from '../../middleware/handleErrors.mid';
import { authenticate } from '../../middleware/validationHeaders';

const router = Router();

router.param('productId', productExists);
router.param('categoryId', categoryExists);

router.use(authenticate);

// POST /product/:categoryId - Create product for this category
router.post('/category/:categoryId',
    [
        body('pr_name').notEmpty().withMessage('Name is required'),
        // RF-03: Validate price > 0
        body('pr_price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
        body('pr_availability').isBoolean().withMessage('Availability must be boolean'),
        handleInputErrors
    ],
    ProductsController.create
);

router.get('/', ProductsController.getAll);

router.get('/:productId', ProductsController.getById);

router.put('/:productId',
    [
        body('pr_name').optional().notEmpty(),
        body('pr_price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
        body('pr_availability').optional().isBoolean(),
        handleInputErrors
    ],
    ProductsController.update
);

router.delete('/:productId', ProductsController.delete);

export default router;
