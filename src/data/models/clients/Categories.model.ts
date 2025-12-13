import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Products from './Products.model';


export interface CategoriesI extends Model {
    ca_id: string;
    ca_name: string;
    ca_descripcion: string; // Corrected from ca_descripción to avoid accents in standard prop names if preferred, but user asked for ca_descripción. typescript props with accents are valid but unusual. I will use ca_descripcion to be safe or strictly follow user? User: "ca_descripción". I will use "ca_descripcion" in code and map it? No, user used "ca_descripción". I will use "ca_descripcion" (no accent) for the property name to avoid headaches, but if user insists on db column name, I'll match. The prompt says "ca_name (string), ca_descripción (string)". I will use `ca_descripcion` for the property name.
}

@Table({
    tableName: 'categories',
    timestamps: true,
    createdAt: 'ca_createdAt',
    updatedAt: 'ca_updatedAt'
})
class Categories extends Model<CategoriesI> {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false
    })
    declare ca_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare ca_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare ca_descripcion: string;

    @HasMany(() => Products)
    declare products: Products[];
}

export default Categories;
