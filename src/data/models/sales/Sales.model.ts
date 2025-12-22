import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Clients from '../clients/Clients.model';

import SaleDetails from './SaleDetails.model';
import { Users } from '../security';


export interface SalesI {
    sa_id?: string;
    sa_client_id: string | null;
    sa_user_id: string;
    sa_fecha: Date;
    sa_total: number;
    sa_medio_de_pago: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Sales:
 *       type: object
 *       required:
 *         - sa_id
 *         - sa_user_id
 *         - sa_fecha
 *         - sa_total
 *         - sa_medio_de_pago
 *       properties:
 *         sa_id:
 *           type: string
 *           format: uuid
 *           description: ID único de la venta (Generado automáticamente)
 *         sa_client_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID del cliente (Opcional, puede ser consumidor final)
 *         sa_user_id:
 *           type: string
 *           format: uuid
 *           description: ID del usuario que registró la venta
 *         sa_fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la venta
 *         sa_total:
 *           type: number
 *           format: float
 *           description: Total de la venta
 *         sa_medio_de_pago:
 *           type: string
 *           description: Medio de pago utilizado
 */
@Table({
    tableName: 'sales',
    timestamps: true,
    createdAt: 'sa_createdAt',
    updatedAt: 'sa_updatedAt'
})
class Sales extends Model<SalesI> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare sa_id: string;

    @ForeignKey(() => Clients)
    @Column({
        type: DataType.UUID,
        allowNull: true // allowNull: true
    })
    declare sa_client_id: string;

    @BelongsTo(() => Clients)
    declare client: Clients;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare sa_user_id: string;

    @BelongsTo(() => Users)
    declare user: Users;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare sa_fecha: Date;

    @Column({
        type: DataType.DECIMAL,
        allowNull: false
    })
    declare sa_total: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare sa_medio_de_pago: string;

    @HasMany(() => SaleDetails)
    declare sale_details: SaleDetails[];
}

export default Sales;
