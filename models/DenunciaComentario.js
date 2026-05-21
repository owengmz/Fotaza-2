import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class DenunciaComentario extends Model { }

DenunciaComentario.init(
  {
    usuarioId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'usuario_id',
    },
    comentarioId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'comentario_id',
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
    modelName: 'DenunciaComentario',
    tableName: 'denuncias_comentario',
    timestamps: true,
    createdAt: 'fecha',
    updatedAt: false,
    paranoid: false,
  },
);