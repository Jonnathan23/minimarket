import { Router } from 'express';
import { UserRolesController } from '../controllers/UserRoles.controller';
import { handleInputErrors } from '../../../middleware/handleErrors.mid';

import { validateRoleExists } from '../middleware/Roles.mid';
import { authenticate } from '../../../middleware/validationHeaders';

const router = Router();

router.param('roleId', validateRoleExists);

router.use(authenticate);

// POST /assign/:userId/:roleId - Assign role to user
router.post('/assign/:userId/:roleId', UserRolesController.assignRole);

// DELETE /remove/:userId/:roleId - Remove role from user
router.delete('/remove/:userId/:roleId', UserRolesController.removeRole);

// GET /list/:userId - List roles by user
router.get('/list/:userId', UserRolesController.listByUser);

export default router;
