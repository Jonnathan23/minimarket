import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Purchases from './Purchases.model';

export interface ProvidersI {
    po_id: string;
    po_nombre: string;
    po_RUC_NIT: string;
    po_direccion: string;
    po_telefono: string;
    po_correo: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Providers:
 *       type: object
 *       required:
 *         - po_id
 *         - po_nombre
 *         - po_RUC_NIT
 *         - po_direccion
 *         - po_telefono
 *         - po_correo
 *       properties:
 *         po_id:
 *           type: string
 *           format: uuid
 *           description: ID único del proveedor (Generado automáticamente)
 *         po_nombre:
 *           type: string
 *           description: Nombre de la empresa o proveedor
 *         po_RUC_NIT:
 *           type: string
 *           description: Registro único de contribuyente o NIT
 *         po_direccion:
 *           type: string
 *           description: Dirección física del proveedor
 *         po_telefono:
 *           type: string
 *           description: Teléfono de contacto
 *         po_correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico del proveedor
 */
@Table({
    tableName: 'providers',
    timestamps: true,
    createdAt: 'po_createdAt',
    updatedAt: 'po_updatedAt'
})
class Providers extends Model<ProvidersI> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare po_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare po_nombre: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare po_RUC_NIT: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare po_direccion: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare po_telefono: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare po_correo: string;

    @HasMany(() => Purchases)
    declare purchases: Purchases[];
}

export default Providers;
