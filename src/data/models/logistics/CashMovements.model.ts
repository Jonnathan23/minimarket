import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Users } from '../security';


export interface CashMovementsI {
    cm_id?: string;
    cm_user_id: string;
    cm_fecha: Date;
    cm_tipo: string;
    cm_monto: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CashMovements:
 *       type: object
 *       required:
 *         - cm_id
 *         - cm_user_id
 *         - cm_fecha
 *         - cm_tipo
 *         - cm_monto
 *       properties:
 *         cm_id:
 *           type: string
 *           format: uuid
 *           description: ID único del movimiento de caja (Generado automáticamente)
 *         cm_user_id:
 *           type: string
 *           format: uuid
 *           description: ID del usuario que registra el movimiento
 *         cm_fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del movimiento
 *         cm_tipo:
 *           type: string
 *           description: Tipo de movimiento (Ingreso/Egreso)
 *         cm_monto:
 *           type: number
 *           format: float
 *           description: Monto de la transacción
 */
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
