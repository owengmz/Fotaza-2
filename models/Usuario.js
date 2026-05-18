// Este archivo define el modelo de Usuario que representa a los usuarios de la aplicacion.
//de aca en adelante se pueden crear otros modelos como Foto, Comentario, etc. siguiendo la misma estructura.
import { Model, DataTypes } from 'sequelize';
import sequelize from './config.js';

export class Usuario extends Model { }
Usuario.init(
  {
    // definicion de los campos de la tabla USUARIOS
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('usuario', 'validador', 'admin'),
      allowNull: false,
      defaultValue: 'usuario',
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo'),
      allowNull: false,
      defaultValue: 'activo',
    },
  },
  // configuracion de Sequelize para este modelo
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    paranoid: true,
  },
);