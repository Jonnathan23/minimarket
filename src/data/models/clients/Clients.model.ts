import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Sales from '../sales/Sales.model';


export interface ClientsI extends Model {
    cl_id: string;
    cl_nombre: string;
    cl_identificación: string; // Keeping as per user request if possible, but TS might dislike. I'll use cl_identificacion.
    cl_teléfono: string; // cl_telefono
    cl_correo: string;
    cl_preferencias_opcionales: string;
}

@Table({
    tableName: 'clients',
    timestamps: true,
    createdAt: 'cl_createdAt',
    updatedAt: 'cl_updatedAt'
})
class Clients extends Model<ClientsI> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare cl_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare cl_nombre: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare cl_identificacion: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare cl_telefono: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare cl_correo: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare cl_preferencias_opcionales: string;

    @HasMany(() => Sales)
    declare sales: Sales[];
}

export default Clients;
