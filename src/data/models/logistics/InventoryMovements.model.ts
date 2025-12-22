import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Products from '../clients/Products.model';

export interface InventoryMovementsI {
    im_id?: string;
    im_product_id: string;
    im_tipo: string;
    im_cantidad: number;
    im_referencia: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryMovements:
 *       type: object
 *       required:
 *         - im_id
 *         - im_product_id
 *         - im_tipo
 *         - im_cantidad
 *         - im_referencia
 *       properties:
 *         im_id:
 *           type: string
 *           format: uuid
 *           description: ID único del movimiento (Generado automáticamente)
 *         im_product_id:
 *           type: string
 *           format: uuid
 *           description: ID del producto afectado
 *         im_tipo:
 *           type: string
 *           description: Tipo de movimiento (Entrada/Salida)
 *         im_cantidad:
 *           type: integer
 *           description: Cantidad de productos movidos
 *         im_referencia:
 *           type: string
 *           description: Referencia o motivo del movimiento
 */
@Table({
    tableName: 'inventory_movements',
    timestamps: true,
    createdAt: 'im_createdAt',
    updatedAt: 'im_updatedAt'
})
class InventoryMovements extends Model<InventoryMovementsI> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare im_id: string;

    @ForeignKey(() => Products)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare im_product_id: string;

    @BelongsTo(() => Products)
    declare product: Products;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare im_tipo: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare im_cantidad: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare im_referencia: string;
}

export default InventoryMovements;
