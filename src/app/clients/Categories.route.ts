import { Router } from 'express';
import { body, param } from 'express-validator';
import { CategoriesController } from './controllers/Categories.controller';
import { categoryExists } from './middleware/Categories.mid';
import { handleInputErrors } from '../../middleware/handleErrors.mid';
import { authenticate } from '../../middleware/validationHeaders';

const router = Router();

router.param('categoryId', categoryExists);

router.use(authenticate);

// POST /category - Create category
router.post('/',
    [
        body('ca_name').notEmpty().withMessage('Name is required'),
        body('ca_descripcion').notEmpty().withMessage('Description is required'),
        handleInputErrors
    ],
    CategoriesController.create
);

router.get('/', CategoriesController.getAll);

router.get('/:categoryId',
    param('categoryId').notEmpty().withMessage('Category ID is required'),
    handleInputErrors,
    CategoriesController.getById
);

router.put('/:categoryId',
    [
        param('categoryId').notEmpty().withMessage('Category ID is required'),
        body('ca_name').optional().notEmpty(),
        body('ca_descripcion').optional().notEmpty(),
        handleInputErrors
    ],
    CategoriesController.update
);

router.delete('/:categoryId',
    param('categoryId').notEmpty().withMessage('Category ID is required'),
    handleInputErrors,
    CategoriesController.delete
);

export default router;
