import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class PublicacionEtiqueta extends Model { }

PublicacionEtiqueta.init(
  {
    publicacionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'publicacion_id',
    },
    etiquetaId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'etiqueta_id',
    },
  },
  {
    sequelize,
    modelName: 'PublicacionEtiqueta',
    tableName: 'publicaciones_etiquetas',
    timestamps: false,
    paranoid: false,
  },
);