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

/**
 * @swagger
 * components:
 *   schemas:
 *     Clients:
 *       type: object
 *       required:
 *         - cl_id
 *         - cl_nombre
 *         - cl_identificacion
 *         - cl_telefono
 *         - cl_correo
 *       properties:
 *         cl_id:
 *           type: string
 *           format: uuid
 *           description: ID único del cliente (Generado automáticamente)
 *         cl_nombre:
 *           type: string
 *           description: Nombre completo del cliente
 *         cl_identificacion:
 *           type: string
 *           description: Identificación oficial del cliente (Cédula/RUC)
 *         cl_telefono:
 *           type: string
 *           description: Número de teléfono de contacto
 *         cl_correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico del cliente
 *         cl_preferencias_opcionales:
 *           type: string
 *           nullable: true
 *           description: Preferencias opcionales del cliente
 */
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
