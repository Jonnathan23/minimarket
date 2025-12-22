import { Router } from 'express';
import { body } from 'express-validator';
import { RolesController } from '../controllers/Roles.controller';
import { validateRoleExists } from '../middleware/Roles.mid';
import { handleInputErrors } from '../../../middleware/handleErrors.mid';
import { authenticate } from '../../../middleware/validationHeaders';


const router = Router();

router.param('ro_id', validateRoleExists);

router.use(authenticate);

// POST /api/roles - Create role
router.post('/',
    [
        body('ro_nombre_del_rol').notEmpty().withMessage('Role name is required'),
        handleInputErrors
    ],
    RolesController.create
);

router.get('/', RolesController.getAll);

router.get('/:ro_id', RolesController.getById);

router.put('/:ro_id',
    [
        body('ro_nombre_del_rol').optional().notEmpty().withMessage('Role name cannot be empty'),
        handleInputErrors
    ],
    RolesController.update
);

router.delete('/:ro_id', RolesController.delete);

export default router;
