import { container } from "tsyringe";
//import { InMemoryUserRepository } from "./infrastructure/db/memory/InMemoryUserRepository";
import { SequelizeUserRepository } from "./infrastructure/db/sequelize/repositories/SequelizeUserRepository";
import { CsvUserExporterAdapter } from "./infrastructure/exporters/CsvUserExporterAdapter";

container.register("UserRepository", {
  useClass: SequelizeUserRepository, 
});

container.register("UserExporterPort", {
  useClass: CsvUserExporterAdapter,
});