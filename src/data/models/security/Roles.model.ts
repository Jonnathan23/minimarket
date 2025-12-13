import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import UserRoles from './UserRoles.model';


export interface RolesI extends Model {
    ro_id: string;
    ro_nombre_del_rol: string;
}

@Table({
    tableName: 'roles',
    timestamps: true,
    createdAt: 'ro_createdAt',
    updatedAt: 'ro_updatedAt'
})
class Roles extends Model<RolesI> {

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

    @HasMany(() => UserRoles)
    declare user_roles: UserRoles[];
}

export default Roles;
