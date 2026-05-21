import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class Imagen extends Model { }

Imagen.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    licencia: {
      type: DataTypes.ENUM('con_copyright', 'sin_copyright'),
      allowNull: false,
    },
    textoMarcaAgua: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'texto_marca_agua',
    },
  },
  {
    sequelize,
    modelName: 'Imagen',
    tableName: 'imagenes',
    timestamps: true,
    paranoid: true,
  },
);