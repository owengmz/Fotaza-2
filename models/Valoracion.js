import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class Valoracion extends Model { }

Valoracion.init(
  {
    usuarioId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'usuario_id',
    },
    imagenId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'imagen_id',
    },
    valor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
  },
  {
    sequelize,
    modelName: 'Valoracion',
    tableName: 'valoraciones',
    timestamps: true,
    createdAt: 'fecha',
    updatedAt: false,
    paranoid: false,
  },
);