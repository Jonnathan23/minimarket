import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Categories from './Categories.model';
import InventoryMovements from '../logistics/InventoryMovements.model';
import PurchaseDetails from '../providers/PurchaseDetails.model';
import SaleDetails from '../sales/SaleDetails.model';


export interface ProductsI {
    pr_id?: string;
    pr_name: string;
    pr_price: number;
    pr_availability: boolean;
    pr_category_id: string;
    pr_stock?: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Products:
 *       type: object
 *       required:
 *         - pr_id
 *         - pr_name
 *         - pr_price
 *         - pr_availability
 *         - pr_stock
 *         - pr_category_id
 *       properties:
 *         pr_id:
 *           type: string
 *           format: uuid
 *           description: ID único del producto (Generado automáticamente)
 *         pr_name:
 *           type: string
 *           description: Nombre del producto
 *         pr_price:
 *           type: number
 *           format: float
 *           description: Precio unitario del producto
 *         pr_availability:
 *           type: boolean
 *           description: Disponibilidad del producto
 *         pr_stock:
 *           type: integer
 *           description: Cantidad en stock (Por defecto 0)
 *         pr_category_id:
 *           type: string
 *           format: uuid
 *           description: ID de la categoría asociada
 */
@Table({
    tableName: 'products',
    timestamps: true,
    createdAt: 'pr_createdAt',
    updatedAt: 'pr_updatedAt'
})
class Products extends Model<ProductsI> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare pr_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare pr_name: string;

    @Column({
        type: DataType.DECIMAL,
        allowNull: false
    })
    declare pr_price: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    declare pr_availability: boolean;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    declare pr_stock: number;

    @ForeignKey(() => Categories)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare pr_category_id: string;

    @BelongsTo(() => Categories)
    declare category: Categories;

    @HasMany(() => InventoryMovements)
    declare inventory_movements: InventoryMovements[];

    @HasMany(() => SaleDetails)
    declare sale_details: SaleDetails[];

    @HasMany(() => PurchaseDetails)
    declare purchase_details: PurchaseDetails[];
}

export default Products;
