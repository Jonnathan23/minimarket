import { Router } from "express";
import { authenticate } from "../../../middleware/validationHeaders";
import parametersRoute from "./Parameters.route";
import userRolesRoute from "./UserRoles.route";
import rolesRoute from "./Roles.route";

export const securityRoute = Router();

securityRoute.use(authenticate);

securityRoute.use('/parameters', parametersRoute);
securityRoute.use('/user-roles', userRolesRoute);
securityRoute.use('/roles', rolesRoute);

