import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class Comentario extends Model { }

Comentario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Comentario',
    tableName: 'comentarios',
    timestamps: true,
    paranoid: true,
  },
);