import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

import Roles from './Roles.model';
import { Users } from '.';

export interface UserRolesI extends Model {
    ur_user_id: string;
    ur_role_id: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRoles:
 *       type: object
 *       required:
 *         - ur_user_id
 *         - ur_role_id
 *       properties:
 *         ur_user_id:
 *           type: string
 *           format: uuid
 *           description: ID del usuario asociado (clave foránea)
 *         ur_role_id:
 *           type: string
 *           format: uuid
 *           description: ID del rol asociado (clave foránea)
 */
@Table({
    tableName: 'user_roles',
    timestamps: true,
    createdAt: 'ur_createdAt',
    updatedAt: 'ur_updatedAt'
})
class UserRoles extends Model {

    @ForeignKey(() => Users)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false
    })
    declare ur_user_id: string;

    @BelongsTo(() => Users)
    declare user: Users;

    @ForeignKey(() => Roles)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false
    })
    declare ur_role_id: string;

    @BelongsTo(() => Roles)
    declare role: Roles;
}

export default UserRoles;
