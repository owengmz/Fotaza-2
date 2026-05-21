import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class ColeccionPublicacion extends Model { }

ColeccionPublicacion.init(
  {
    coleccionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'coleccion_id',
    },
    publicacionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'publicacion_id',
    },
  },
  {
    sequelize,
    modelName: 'ColeccionPublicacion',
    tableName: 'colecciones_publicaciones',
    timestamps: false,
    paranoid: false,
  },
);