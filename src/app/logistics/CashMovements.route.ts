import { Router } from 'express';
import { body, param } from 'express-validator';
import { CashMovementsController } from './controllers/CashMovements.controller';
import { cashMovementExists } from './middleware/CashMovements.mid';
import { handleInputErrors } from '../../middleware/handleErrors.mid';
import { authenticate } from '../../middleware/validationHeaders';

const router = Router();

router.param('cashMovementId', cashMovementExists);

router.use(authenticate);

// POST /cash - Create cash movement (user ID from auth)
router.post('/cash',
    [
        body('cm_fecha').isISO8601().toDate().withMessage('Date is required'),
        body('cm_tipo').isIn(['APERTURA', 'ARQUEO', 'CIERRE']).withMessage('Type must be APERTURA, ARQUEO or CIERRE'),
        body('cm_monto').isFloat().withMessage('Amount is required'),
        handleInputErrors
    ],
    CashMovementsController.create
);

router.get('/', CashMovementsController.getAll);

router.get('/:cashMovementId',
    param('cashMovementId').notEmpty().withMessage('Cash Movement ID is required'),
    handleInputErrors,
    CashMovementsController.getById
);

export default router;