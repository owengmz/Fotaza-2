import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class Notificacion extends Model { }

Notificacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo: {
      type: DataTypes.ENUM(
        'nuevo_comentario',
        'nueva_valoracion',
        'me_interesa',
        'nuevo_seguidor',
      ),
      allowNull: false,
    },
    leida: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Notificacion',
    tableName: 'notificaciones',
    timestamps: true,
    createdAt: 'fecha',
    updatedAt: false,
    paranoid: false,
  },
);