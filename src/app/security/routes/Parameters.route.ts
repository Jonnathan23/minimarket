import { Router } from 'express';
import { body, param } from 'express-validator';
import { ParametersController } from '../controllers/Parameters.controller';
import { parameterExists } from '../middleware/Parameters.mid';
import { handleInputErrors } from '../../../middleware/handleErrors.mid';
import { authenticate } from '../../../middleware/validationHeaders';

const router = Router();

router.param('parameterId', parameterExists);

router.use(authenticate);

// POST /parameter - Create parameter
router.post('/',
    [
        body('pa_clave').notEmpty().withMessage('Key is required'),
        body('pa_valor').notEmpty().withMessage('Value is required'),
        handleInputErrors
    ],
    ParametersController.create
);

router.get('/', ParametersController.getAll);

router.get('/:parameterId',
    param('parameterId').notEmpty().withMessage('Parameter ID is required'),
    handleInputErrors,
    ParametersController.getById
);

router.put('/:parameterId',
    [
        param('parameterId').notEmpty().withMessage('Parameter ID is required'),
        body('pa_clave').optional().notEmpty(),
        body('pa_valor').optional().notEmpty(),
        handleInputErrors
    ],
    ParametersController.update
);

router.delete('/:parameterId',
    param('parameterId').notEmpty().withMessage('Parameter ID is required'),
    handleInputErrors,
    ParametersController.delete
);

export default router;
