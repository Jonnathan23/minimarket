import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import UserRoles from './UserRoles.model';
import Users from './Users.model';


export interface RolesI extends Model {
    ro_id: string;
    ro_nombre_del_rol: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Roles:
 *       type: object
 *       required:
 *         - ro_id
 *         - ro_nombre_del_rol
 *       properties:
 *         ro_id:
 *           type: string
 *           format: uuid
 *           description: ID único del rol (Generado automáticamente)
 *         ro_nombre_del_rol:
 *           type: string
 *           description: Nombre descriptivo del rol
 */
@Table({
    tableName: 'roles',
    timestamps: true,
    createdAt: 'ro_createdAt',
    updatedAt: 'ro_updatedAt'
})
class Roles extends Model {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare ro_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare ro_nombre_del_rol: string;

    //@HasMany(() => UserRoles)
    //declare user_roles: UserRoles[];

    @HasMany(() => Users)
    declare users: Users[];
}

export default Roles;
