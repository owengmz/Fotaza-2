import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class Mensaje extends Model { }

Mensaje.init(
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
    leido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Mensaje',
    tableName: 'mensajes',
    timestamps: true,
    createdAt: 'fecha',
    updatedAt: false,
    paranoid: false,
    validate: {
      noMensajeAUnoMismo() {
        if (this.remitenteId === this.destinatarioId) {
          throw new Error('Un usuario no puede enviarse mensajes a si mismo');
        }
      },
    },
  },
);