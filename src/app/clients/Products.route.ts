import { Router } from 'express';
import { body, param } from 'express-validator';
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
        param('categoryId').notEmpty().withMessage('Category ID is required'),
        body('pr_name').notEmpty().withMessage('Name is required'),
        // RF-03: Validate price > 0
        body('pr_price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
        body('pr_availability').isBoolean().withMessage('Availability must be boolean'),
        handleInputErrors
    ],
    ProductsController.create
);

router.get('/', ProductsController.getAll);

router.get('/:productId',
    param('productId').notEmpty().withMessage('Product ID is required'),
    handleInputErrors,
    ProductsController.getById
);

router.put('/:productId',
    [
        param('productId').notEmpty().withMessage('Product ID is required'),
        body('pr_name').optional().notEmpty(),
        body('pr_price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
        body('pr_availability').optional().isBoolean(),
        handleInputErrors
    ],
    ProductsController.update
);

router.delete('/:productId',
    param('productId').notEmpty().withMessage('Product ID is required'),
    handleInputErrors,
    ProductsController.delete
);

export default router;
