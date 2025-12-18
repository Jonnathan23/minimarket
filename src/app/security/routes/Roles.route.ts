import { Router } from 'express';
import { body } from 'express-validator';
import { RolesController } from '../controllers/Roles.controller';
import { roleExists } from '../middleware/Roles.mid';
import { handleInputErrors } from '../../../middleware/handleErrors.mid';
import { authenticate } from '../../../middleware/validationHeaders';

const router = Router();

router.param('roleId', roleExists);

router.use(authenticate);

// POST /role - Create role
router.post('/roles',
    [
        body('ro_nombre_del_rol').notEmpty().withMessage('Role name is required'),
        handleInputErrors
    ],
    RolesController.create
);

router.get('/roles', RolesController.getAll);

router.get('/roles/:roleId', RolesController.getById);

router.put('/roles/:roleId',
    [
        body('ro_nombre_del_rol').optional().notEmpty().withMessage('Role name cannot be empty'),
        handleInputErrors
    ],
    RolesController.update
);

router.delete('/roles/:roleId', RolesController.delete);

export default router;
