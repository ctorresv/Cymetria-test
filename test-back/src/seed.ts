import "reflect-metadata";
import sequelize from "./infrastructure/db/sequelize/config/database";
import { UserModel } from "./infrastructure/db/sequelize/models/user.model";

async function seed() {
    try {
        await sequelize.authenticate();
        console.log("✅ Conectado a la BD");

        await sequelize.sync({ force: true }); 
        console.log("✅ Tabla sincronizada");

        const TOTAL_USERS = 5000; 
        const users = [];
        const now = Date.now();

        for (let i = 1; i <= TOTAL_USERS; i++) {
            users.push({
                name: `Usuario ${i}`,
                email: `usuario${i}@example.com`,
                createdAt: new Date(now - i * 60000),
            });
        }

        const batchSize = 500;
        for (let i = 0; i < users.length; i += batchSize) {
            const batch = users.slice(i, i + batchSize);
            await UserModel.bulkCreate(batch);
            console.log(`📦 Insertados ${Math.min(i + batchSize, TOTAL_USERS)} / ${TOTAL_USERS}`);
        }

        console.log(`🎉 Seed completado: ${TOTAL_USERS} usuarios creados`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error en seed:", error);
        process.exit(1);
    }
}

seed();