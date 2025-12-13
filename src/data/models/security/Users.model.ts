import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull, HasMany } from 'sequelize-typescript';
import UserRoles from './UserRoles.model';
import Sales from '../sales/Sales.model';
import CashMovements from '../logistics/CashMovements.model';




// Interfaz para la definición de tipos
export interface UsersI extends Model {
    us_id: string;
    us_username: string;
    us_password_encriptado: string;
    us_nombre_completo: string;
    us_estado: boolean;
}

@Table({
    tableName: 'users',
    timestamps: true,
    createdAt: 'us_createdAt',
    updatedAt: 'us_updatedAt'
})
class Users extends Model<UsersI> {

    //* |------| | PK | |------|
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare us_id: string;


    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true // El username debe ser único
    })
    declare us_username: string;


    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare us_password_encriptado: string;


    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare us_nombre_completo: string;


    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true // Asumimos que por defecto está activo
    })
    declare us_estado: boolean;


    //* |------| | HasMany | |------|
    // Relación M:M con Roles (a través de UserRoles)
    @HasMany(() => UserRoles)
    declare user_roles: UserRoles[];

    // Relación 1:N con Sales (Un usuario registra muchas ventas)
    @HasMany(() => Sales)
    declare sales: Sales[];

    // Relación 1:N con CashMovements (Un usuario realiza muchos movimientos de caja)
    @HasMany(() => CashMovements)
    declare cash_movements: CashMovements[];
}


export default Users;