import dotenv from "dotenv";
import path from "path";

// 1. Determinar el entorno
const env = process.env.NODE_ENV || "development";

// 2. Cargar el archivo .env correspondiente
dotenv.config({
	path: path.resolve(__dirname, `../../.env.${env}`),
});

console.log(`[ENV] Loaded .env.${env}`);

// 3. Función auxiliar para garantizar que una variable exista (Fail-Fast)
// Si no existe y no tiene default, lanza un error inmediato al iniciar la app.
const getEnvVar = (key: string, defaultValue?: string): string => {
	const value = process.env[key];
	if (value === undefined || value.trim() === "") {
		if (defaultValue !== undefined) {
			return defaultValue;
		}
		throw new Error(`❌ Variable de entorno requerida '${key}' no está definida en .env.${env}`);
	}
	return value;
};

// 4. Definir interfaces explícitas para el autocompletado y la seguridad de tipos
export interface EnvDB {
	DB_HOST: string;
	DB_PORT: string;
	DB_USER: string;
	DB_PASSWORD: string;
	DB_NAME: string;
}

export interface EnvApp {
	IS_DEVELOPMENT: boolean;
}

// 5. Exportar objetos tipados y validados
export const ENVS_DB: EnvDB = {
	DB_HOST: getEnvVar("DB_HOST"),
	DB_PORT: getEnvVar("DB_PORT"),
	DB_USER: getEnvVar("DB_USER"),
	DB_PASSWORD: getEnvVar("DB_PASSWORD"),
	DB_NAME: getEnvVar("DB_NAME"),
};

export const ENVS_APP: EnvApp = {
	IS_DEVELOPMENT: getEnvVar("NODE_ENV", "development") !== "production",
};