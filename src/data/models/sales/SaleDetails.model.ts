import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Sales from './Sales.model';
import Products from '../clients/Products.model';

export interface SaleDetailsI {
    sd_id?: string;
    sd_sale_id: string;
    sd_product_id: string;
    sd_cantidad: number;
    sd_precio_unitario: number;
}

@Table({
    tableName: 'sale_details',
    timestamps: true,
    createdAt: 'sd_createdAt',
    updatedAt: 'sd_updatedAt'
})
class SaleDetails extends Model<SaleDetailsI> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare sd_id: string;

    @ForeignKey(() => Sales)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare sd_sale_id: string;

    @BelongsTo(() => Sales)
    declare sale: Sales;

    @ForeignKey(() => Products)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare sd_product_id: string;

    @BelongsTo(() => Products)
    declare product: Products;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare sd_cantidad: number;

    @Column({
        type: DataType.DECIMAL,
        allowNull: false
    })
    declare sd_precio_unitario: number;
}

export default SaleDetails;
