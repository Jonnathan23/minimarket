import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Purchases from './Purchases.model';

export interface ProvidersI {
    po_id: string;
    po_nombre: string;
    po_RUC_NIT: string;
    po_direccion: string;
    po_telefono: string;
    po_correo: string;
}

@Table({
    tableName: 'providers',
    timestamps: true,
    createdAt: 'po_createdAt',
    updatedAt: 'po_updatedAt'
})
class Providers extends Model<ProvidersI> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare po_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare po_nombre: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare po_RUC_NIT: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare po_direccion: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare po_telefono: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare po_correo: string;

    @HasMany(() => Purchases)
    declare purchases: Purchases[];
}

export default Providers;
