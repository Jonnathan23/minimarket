import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Providers from './Providers.model';
import PurchaseDetails from './PurchaseDetails.model';


export interface PurchasesI {
    pu_id?: string;
    pu_provider_id: string;
    pu_fecha: Date;
    pu_total: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Purchases:
 *       type: object
 *       required:
 *         - pu_id
 *         - pu_provider_id
 *         - pu_fecha
 *         - pu_total
 *       properties:
 *         pu_id:
 *           type: string
 *           format: uuid
 *           description: ID único de la compra (Generado automáticamente)
 *         pu_provider_id:
 *           type: string
 *           format: uuid
 *           description: ID del proveedor
 *         pu_fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la compra
 *         pu_total:
 *           type: number
 *           format: float
 *           description: Monto total de la compra
 */
@Table({
    tableName: 'purchases',
    timestamps: true,
    createdAt: 'pu_createdAt',
    updatedAt: 'pu_updatedAt'
})
class Purchases extends Model<PurchasesI> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare pu_id: string;

    @ForeignKey(() => Providers)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare pu_provider_id: string;

    @BelongsTo(() => Providers)
    declare provider: Providers;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare pu_fecha: Date;

    @Column({
        type: DataType.DECIMAL,
        allowNull: false
    })
    declare pu_total: number;

    @HasMany(() => PurchaseDetails)
    declare purchase_details: PurchaseDetails[];
}

export default Purchases;
