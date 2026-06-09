import 'dotenv/config';
import { Sequelize } from 'sequelize';

let sequelize;

if (process.env.DATABASE_URL) {
  // en Render usa la URL completa
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // en desarrollo usa las variables individuales
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
  });
}

export default sequelize;