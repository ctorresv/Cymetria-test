import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./infrastructure/http/swaggerSpec";
import cors from "cors";
import UserRoute from "./infrastructure/http/routes/v1/user.route";
import sequelize from "./infrastructure/db/sequelize/config/database"
import { errorHandler } from "./infrastructure/http/middlewares/errorHandler";


export default class App {
	public app: Application;
	private readonly port: number | string;

	constructor(port: number | string = 4000) {
		this.app = express();
		this.port = port;

		this.initializeMiddlewares();
		this.initializeSwagger();
		this.initializeRoutes();
		this.initializeDatabase();
		this.initialzeSyncDatabase();
		this.initializeErrorHandling();
	}

	private initializeMiddlewares(): void {
		this.app.use(cors({
			origin: process.env.FRONTEND_URL || "http://localhost:3000",
			credentials: true,
		}));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private initializeSwagger(): void {

		this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	}

	private initializeRoutes(): void {
		this.app.use("/api/v1/users", UserRoute);
	}
	private initializeErrorHandling(): void {
		this.app.use(errorHandler);
	}

	private initializeDatabase(): void {
		sequelize
			.authenticate()
			.then(() => {
				console.table({
					"✅ Conexión a la base de datos establecida con éxito": {
						dbName: sequelize.getDatabaseName(),
						dialect: sequelize.getDialect(),
					},
				});
			})
			.catch((error) => {
				console.table({
					"❌ Error al conectar a la base de datos": error,
				});
			});
	}
	private initialzeSyncDatabase(): void {
		sequelize
			.sync()
			.then(() => {
				console.table({
					"✅ Base de datos sincronizada con éxito": {
						dbName: sequelize.getDatabaseName(),
						dialect: sequelize.getDialect(),
					},
				});
			})
			.catch((error) => {
				console.table({
					"❌ Error al sincronizar la base de datos": error,
				});
			});
	}

	public listen(): void {
		this.app.listen(this.port, () => {
			console.table({
				"Server is running on": `http://localhost:${this.port}`,
				Environment: process.env.NODE_ENV,
				Database: sequelize.getDatabaseName(),
			});
		});
	}

	public getServer(): Application {
		return this.app;
	}
}
