import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Purchases from './Purchases.model';
import Products from '../clients/Products.model';

export interface PurchaseDetailsI {
    pd_id?: string;
    pd_purchase_id: string;
    pd_product_id: string;
    pd_cantidad: number;
    pd_precio_unitario: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PurchaseDetails:
 *       type: object
 *       required:
 *         - pd_id
 *         - pd_purchase_id
 *         - pd_product_id
 *         - pd_cantidad
 *         - pd_precio_unitario
 *       properties:
 *         pd_id:
 *           type: string
 *           format: uuid
 *           description: ID único del detalle de compra (Generado automáticamente)
 *         pd_purchase_id:
 *           type: string
 *           format: uuid
 *           description: ID de la compra asociada
 *         pd_product_id:
 *           type: string
 *           format: uuid
 *           description: ID del producto comprado
 *         pd_cantidad:
 *           type: integer
 *           description: Cantidad de productos comprados
 *         pd_precio_unitario:
 *           type: number
 *           format: float
 *           description: Costo unitario del producto en esta compra
 */
@Table({
    tableName: 'purchase_details',
    timestamps: true,
    createdAt: 'pd_createdAt',
    updatedAt: 'pd_updatedAt'
})
class PurchaseDetails extends Model<PurchaseDetailsI> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare pd_id: string;

    @ForeignKey(() => Purchases)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare pd_purchase_id: string;

    @BelongsTo(() => Purchases)
    declare purchase: Purchases;

    @ForeignKey(() => Products)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare pd_product_id: string;

    @BelongsTo(() => Products)
    declare product: Products;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare pd_cantidad: number;

    @Column({
        type: DataType.DECIMAL,
        allowNull: false
    })
    declare pd_precio_unitario: number;
}

export default PurchaseDetails;
