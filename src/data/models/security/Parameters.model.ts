import { Table, Column, Model, DataType } from 'sequelize-typescript';

export interface ParametersI extends Model {
    pa_id: string;
    pa_clave: string;
    pa_valor: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Parameters:
 *       type: object
 *       required:
 *         - pa_id
 *         - pa_clave
 *         - pa_valor
 *       properties:
 *         pa_id:
 *           type: string
 *           format: uuid
 *           description: ID único del parámetro (Generado automáticamente)
 *         pa_clave:
 *           type: string
 *           description: Clave única del parámetro
 *         pa_valor:
 *           type: string
 *           description: Valor asignado al parámetro
 */
@Table({
    tableName: 'parameters',
    timestamps: true,
    createdAt: 'pa_createdAt',
    updatedAt: 'pa_updatedAt'
})
class Parameters extends Model {

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
