import { Router } from 'express';
import { UserRolesController } from '../controllers/UserRoles.controller';
import { handleInputErrors } from '../../../middleware/handleErrors.mid';
import { authenticate } from '../../../middleware/validationHeaders';
import { roleExists } from '../middleware/Roles.mid';

const router = Router();

router.param('roleId', roleExists);

router.use(authenticate);

// POST /assign/:userId/:roleId - Assign role to user
router.post('user-roles/assign/:userId/:roleId', UserRolesController.assignRole);

// DELETE /remove/:userId/:roleId - Remove role from user
router.delete('user-roles/remove/:userId/:roleId', UserRolesController.removeRole);

// GET /list/:userId - List roles by user
router.get('user-roles/list/:userId', UserRolesController.listByUser);

export default router;
