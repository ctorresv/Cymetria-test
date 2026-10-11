import { Sequelize, Options } from "sequelize";
import { ENVS_DB, ENVS_APP } from "../../../../config/envs.config";

// 1. Definir las opciones de conexión con el tipo oficial de Sequelize
const sequelizeOptions: Options = {
    host: ENVS_DB.DB_HOST,
    port: parseInt(ENVS_DB.DB_PORT, 10), // Base 10 explícita para evitar warnings
    dialect: "postgres",
    // logging acepta boolean o una función. console.log es válido.
    logging: ENVS_APP.IS_DEVELOPMENT ? console.log : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

// 2. Instanciar Sequelize. 
const sequelize = new Sequelize(
    ENVS_DB.DB_NAME,
    ENVS_DB.DB_USER,
    ENVS_DB.DB_PASSWORD,
    sequelizeOptions
);

export default sequelize;