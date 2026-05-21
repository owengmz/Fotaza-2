import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class DenunciaImagen extends Model { }

DenunciaImagen.init(
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
    motivo: {
      type: DataTypes.ENUM('contenido_inapropiado', 'copyright', 'spam', 'otro'),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'DenunciaImagen',
    tableName: 'denuncias_imagen',
    timestamps: true,
    createdAt: 'fecha',
    updatedAt: false,
    paranoid: false,
  },
);