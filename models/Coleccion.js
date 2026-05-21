import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class Coleccion extends Model { }

Coleccion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Coleccion',
    tableName: 'colecciones',
    timestamps: true,
    paranoid: true,
  },
);