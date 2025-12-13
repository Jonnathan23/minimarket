import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Categories from './Categories.model';
import InventoryMovements from '../logistics/InventoryMovements.model';
import PurchaseDetails from '../providers/PurchaseDetails.model';
import SaleDetails from '../sales/SaleDetails.model';


export interface ProductsI extends Model {
    pr_id: string;
    pr_name: string;
    pr_price: number;
    pr_availability: boolean;
    pr_category_id: string;
}

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
