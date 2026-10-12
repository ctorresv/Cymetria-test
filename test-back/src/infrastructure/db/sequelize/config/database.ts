import { Sequelize, Options } from "sequelize";
import { ENVS_DB, ENVS_APP } from "../../../../config/envs.config";


const sequelizeOptions: Options = {
    host: ENVS_DB.DB_HOST,
    port: parseInt(ENVS_DB.DB_PORT, 10), 
    dialect: "postgres",
    logging: ENVS_APP.IS_DEVELOPMENT ? console.log : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

const sequelize = new Sequelize(
    ENVS_DB.DB_NAME,
    ENVS_DB.DB_USER,
    ENVS_DB.DB_PASSWORD,
    sequelizeOptions
);

export default sequelize;