import { Router } from 'express';
import { body } from 'express-validator';
import { ProvidersController } from './controllers/Providers.controller';
import { providerExists } from './middleware/Providers.mid';
import { handleInputErrors } from '../../middleware/handleErrors.mid';
import { authenticate } from '../../middleware/validationHeaders';

const router = Router();

router.param('providerId', providerExists);

router.use(authenticate);

// POST /provider - Create provider
router.post('/provider',
    [
        body('po_nombre').notEmpty().withMessage('Name is required'),
        body('po_RUC_NIT').notEmpty().withMessage('RUC/NIT is required'),
        body('po_direccion').notEmpty().withMessage('Address is required'),
        body('po_telefono').notEmpty().withMessage('Phone is required'),
        body('po_correo').isEmail().withMessage('Valid email is required'),
        handleInputErrors
    ],
    ProvidersController.create
);

router.get('/', ProvidersController.getAll);

router.get('/:providerId', ProvidersController.getById);

router.put('/:providerId',
    [
        body('po_nombre').optional().notEmpty(),
        body('po_RUC_NIT').optional().notEmpty(),
        body('po_direccion').optional().notEmpty(),
        body('po_telefono').optional().notEmpty(),
        body('po_correo').optional().isEmail(),
        handleInputErrors
    ],
    ProvidersController.update
);

router.delete('/:providerId', ProvidersController.delete);

export default router;
