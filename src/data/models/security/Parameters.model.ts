import { Table, Column, Model, DataType } from 'sequelize-typescript';

export interface ParametersI extends Model {
    pa_id: string;
    pa_clave: string;
    pa_valor: string;
}

@Table({
    tableName: 'parameters',
    timestamps: true,
    createdAt: 'pa_createdAt',
    updatedAt: 'pa_updatedAt'
})
class Parameters extends Model<ParametersI> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare pa_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare pa_clave: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare pa_valor: string;
}

export default Parameters;
