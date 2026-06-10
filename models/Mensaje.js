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
    remitenteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'remitente_id',
    },
    destinatarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'destinatario_id',
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
    imagenId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'imagen_id',
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
        if (parseInt(this.remitenteId) === parseInt(this.destinatarioId)) {
          throw new Error('Un usuario no puede enviarse mensajes a si mismo');
        }
      },
    },
  },
);