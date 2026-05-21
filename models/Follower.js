import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class Follower extends Model { }

Follower.init(
  {
    usuarioSeguidorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'usuario_seguidor_id',
    },
    usuarioSeguidoId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'usuario_seguido_id',
    },
  },
  {
    sequelize,
    modelName: 'Follower',
    tableName: 'followers',
    timestamps: true,
    createdAt: 'fecha',
    updatedAt: false,
    paranoid: false,
    validate: {
      noAutoseguirse() {
        if (this.usuarioSeguidorId === this.usuarioSeguidoId) {
          throw new Error('Un usuario no puede seguirse a si mismo');
        }
      },
    },
  },
);