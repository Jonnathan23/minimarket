import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Users } from '../security';


export interface CashMovementsI {
    cm_id?: string;
    cm_user_id: string;
    cm_fecha: Date;
    cm_tipo: string;
    cm_monto: number;
}

@Table({
    tableName: 'cash_movements',
    timestamps: true,
    createdAt: 'cm_createdAt',
    updatedAt: 'cm_updatedAt'
})
class CashMovements extends Model<CashMovementsI> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare cm_id: string;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare cm_user_id: string;

    @BelongsTo(() => Users)
    declare user: Users;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare cm_fecha: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare cm_tipo: string;

    @Column({
        type: DataType.DECIMAL,
        allowNull: false
    })
    declare cm_monto: number;
}

export default CashMovements;
