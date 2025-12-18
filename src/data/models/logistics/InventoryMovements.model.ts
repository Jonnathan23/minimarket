import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Products from '../clients/Products.model';

export interface InventoryMovementsI {
    im_id?: string;
    im_product_id: string;
    im_tipo: string;
    im_cantidad: number;
    im_referencia: string;
}

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
