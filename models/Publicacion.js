import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class Publicacion extends Model { }

Publicacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuario_id',
    },
    comentariosAbiertos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'comentarios_abiertos',
    },
    estado: {
      type: DataTypes.ENUM('activa', 'bajada', 'pendiente_revision'),
      allowNull: false,
      defaultValue: 'activa',
    },
  },
  {
    sequelize,
    modelName: 'Publicacion',
    tableName: 'publicaciones',
    timestamps: true,
    paranoid: true,
  },
);