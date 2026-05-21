import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class Etiqueta extends Model { }

Etiqueta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Etiqueta',
    tableName: 'etiquetas',
    timestamps: false,
    paranoid: false,
  },
);