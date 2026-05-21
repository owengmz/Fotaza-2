import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class MeInteresa extends Model { }

MeInteresa.init(
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
  },
  {
    sequelize,
    modelName: 'MeInteresa',
    tableName: 'me_interesa',
    timestamps: true,
    createdAt: 'fecha',
    updatedAt: false,
    paranoid: false,
  },
);